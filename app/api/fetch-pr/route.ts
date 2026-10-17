import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prUrl } = await req.json();

    if (!prUrl || typeof prUrl !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid GitHub Pull Request URL." },
        { status: 400 }
      );
    }

    // Match GitHub PR URL: https://github.com/:owner/:repo/pull/:pullNumber
    const match = prUrl.match(
      /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/i
    );

    if (!match) {
      return NextResponse.json(
        {
          error:
            "Invalid GitHub PR URL format. Expected: https://github.com/owner/repo/pull/123",
        },
        { status: 400 }
      );
    }

    const [, owner, repo, pullNumber] = match;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`;

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3.diff",
        "User-Agent": "UnderstandGuard-Audit-Bot",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `GitHub API returned ${response.status}: ${response.statusText}. Please verify the repository and PR number are public.`,
        },
        { status: response.status }
      );
    }

    const diffText = await response.text();

    return NextResponse.json({
      owner,
      repo,
      pullNumber,
      diffText,
      prTitle: `${owner}/${repo}#${pullNumber}`,
    });
  } catch (error) {
    console.error("Error fetching PR diff:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub PR diff. Please verify the URL." },
      { status: 500 }
    );
  }
}
