export const PYTHON_DEMO_DIFF_TEXT = `--- a/services/payment_worker.py
+++ b/services/payment_worker.py
@@ -18,28 +18,38 @@ class PaymentProcessor:
         self.db_pool = db_pool
         self.stripe_client = stripe_client
 
+    async def process_checkout_charge(self, user_id: str, order_id: str, amount_cents: int) -> dict:
+        """AI-Generated Stripe Charge & Order Fulfillment Handler"""
+        async with self.db_pool.acquire() as conn:
+            # Step 1: Record initial pending order in database
+            await conn.execute(
+                "INSERT INTO orders (id, user_id, amount, status) VALUES ($1, $2, $3, 'PENDING')",
+                order_id, user_id, amount_cents
+            )
+            
+            # Step 2: Charge customer card via external payment gateway
+            charge_result = await self.stripe_client.charges.create(
+                amount=amount_cents,
+                currency="usd",
+                customer=user_id,
+                description=f"Order {order_id}"
+            )
+            
+            # Step 3: Mark order paid
+            if charge_result.status == "succeeded":
+                await conn.execute(
+                    "UPDATE orders SET status = 'PAID', stripe_charge_id = $1 WHERE id = $2",
+                    charge_result.id, order_id
+                )
+                return {"status": "success", "order_id": order_id}
+            else:
+                raise PaymentError("Stripe declined payment")`;

export const PYTHON_DEMO_QUESTIONS = [
  {
    id: "py_q1",
    targetLine: 22,
    targetFunction: "process_checkout_charge()",
    prompt:
      "Line 22 acquires a connection without 'async with conn.transaction():'. If the database UPDATE fails in Line 38 after Stripe has already charged the card, what state is the order left in?",
    contextSnippet: "async with self.db_pool.acquire() as conn:",
    expectedInsight:
      "Recognize that without an atomic transaction or compensation saga, the customer is billed but the order remains in PENDING state.",
  },
  {
    id: "py_q2",
    targetLine: 30,
    targetFunction: "process_checkout_charge()",
    prompt:
      "Line 30 calls stripe_client.charges.create() without an 'idempotency_key'. If this Celery/asyncio worker task times out and is automatically retried, what prevents the customer from being double-charged?",
    contextSnippet: "charge_result = await self.stripe_client.charges.create(...)",
    expectedInsight:
      "Identify the missing idempotency key. Automatic task retries will re-execute the Stripe charge and bill the customer multiple times.",
  },
  {
    id: "py_q3",
    targetLine: 39,
    targetFunction: "process_checkout_charge()",
    prompt:
      "Line 39 raises PaymentError when Stripe declines. How does your service clean up the PENDING database record created in Step 1?",
    contextSnippet: "else: raise PaymentError('Stripe declined payment')",
    expectedInsight:
      "Explain the orphaned row issue: declined charges leave zombie PENDING rows in the orders table.",
  },
];

export const PYTHON_SAMPLE_ANSWERS = {
  py_q1: "It connects to PostgreSQL, creates a pending order, calls Stripe API, and updates to PAID if successful.",
  py_q2: "It handles retries automatically through the exception handling and worker framework.",
  py_q3: "The exception bubbles up to the caller.",
};

export const PYTHON_DEMO_EVALUATION = {
  comprehensionScore: 54,
  riskLevel: "HIGH" as const,
  verdictBadge: "High Cognitive Debt – Review Required" as const,
  flaggedFunction: "process_checkout_charge() (Lines 21–44)",
  flaggedReason:
    "Author failed to explain payment idempotency and transaction boundaries. Critical risk of customer double-billing during network retries.",
  rubricScores: {
    technicalSpecificity: 4,
    concurrencyAwareness: 3,
    mitigationAccuracy: 4,
    critique:
      "The author provided surface-level answers with no awareness of payment idempotency or atomic database transactions. Relying on Celery retries without an Idempotency-Key guarantees double-charges in production.",
  },
  adversarialTest: {
    targetFunction: "process_checkout_charge()",
    targetLine: 30,
    testFramework: "vitest" as const, // Rendered cleanly in test viewer
    testCode: `@pytest.mark.asyncio
async def test_duplicate_charge_on_worker_timeout(payment_processor, mock_stripe):
    # Simulate first attempt where Stripe charges but DB connection drops
    mock_stripe.simulate_timeout_after_charge(order_id="ord_99")
    
    # Worker automatically retries task
    await payment_processor.process_checkout_charge(
        user_id="usr_123", order_id="ord_99", amount_cents=4900
    )
    
    # ❌ Assertion Failure:
    # assert mock_stripe.charge_count == 1
    # E AssertionError: assert 2 == 1 (Customer double-billed $49.00 on task retry)`,
    assertionFailure:
      "assert mock_stripe.charge_count == 1  # ❌ FAILED: 2 == 1 (Customer double-billed $49.00 on worker retry)",
    vulnerabilityExplanation:
      "Without passing idempotency_key=f'order_{order_id}' to stripe.charges.create(), network timeouts and automatic task retries will execute duplicate credit card charges against the user.",
  },
  mentorExplanation: {
    seniorPerspective:
      "In distributed financial pipelines, NEVER perform external state mutations (like charging cards) inside non-transactional code without an Idempotency Key. If the database or network hiccups after Stripe succeeds, the system loses sync and automatic retries will bill the customer twice.",
    recommendedFix: `// Add idempotency key and atomic transaction:
async with conn.transaction():
    await conn.execute("INSERT INTO orders ...")
    charge = await self.stripe.charges.create(
        amount=amount, customer=user_id,
        idempotency_key=f"order_charge_{order_id}"  # Prevents double-billing!
    )`,
  },
  cognitiveMapMarkdown: `# COGNITIVE MAP: services/payment_worker.py

**Verdict:** 🚨 **High Cognitive Debt – Review Required**  
**Comprehension Score:** 54/100  
**Primary Blind Spot:** Missing Idempotency Key in Stripe Charge  

### Component Flow & Double-Billing Point
\`\`\`mermaid
sequenceDiagram
    autonumber
    participant Worker as Celery Payment Worker
    participant DB as Postgres DB
    participant Stripe as Stripe Gateway

    Worker->>DB: INSERT order PENDING (ord_99)
    Worker->>Stripe: charges.create($49.00) [No Idempotency Key!]
    Stripe-->>Worker: Charge Succeeded (ch_abc123)
    Note over Worker,DB: Network Timeout during DB update!
    Worker-->>Worker: Task crashes & triggers Celery Auto-Retry
    Worker->>Stripe: Retry charges.create($49.00) (Duplicate!)
    Stripe-->>Worker: Charge Succeeded Again! (ch_xyz789)
    Note over Worker,Stripe: ❌ Customer billed TWICE ($98.00) for one order!
\`\`\`

### Mitigation
Pass \`idempotency_key=f"order_{order_id}"\` to Stripe and wrap DB operations in \`async with conn.transaction():\`.`,
};
