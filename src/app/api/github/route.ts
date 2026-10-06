import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Nexus-Developer-Universe',
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  try {
    // 1. Fetch User profile
    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers,
      next: { revalidate: 300 }, // Cache 5 min
    });

    if (!userRes.ok) {
      if (userRes.status === 404) {
        return NextResponse.json({ error: 'GitHub user not found' }, { status: 404 });
      }
      if (userRes.status === 403) {
        return NextResponse.json(
          { error: 'GitHub API rate limit exceeded. Please try again later or configure GITHUB_TOKEN.' },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: `GitHub API error: ${userRes.statusText}` },
        { status: userRes.status }
      );
    }

    const userData = await userRes.json();

    // 2. Fetch Repositories
    const reposRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=30`,
      { headers, next: { revalidate: 300 } }
    );

    let repos = [];
    if (reposRes.ok) {
      repos = await reposRes.json();
    }

    // 3. Fetch Recent Public Events to build real activity heatmap
    const eventsRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/events?per_page=100`,
      { headers, next: { revalidate: 180 } }
    );

    let events: Array<{ type: string; created_at: string; repo: { name: string } }> = [];
    if (eventsRes.ok) {
      events = await eventsRes.json();
    }

    return NextResponse.json({
      user: {
        login: userData.login,
        name: userData.name || userData.login,
        bio: userData.bio,
        avatarUrl: userData.avatar_url,
        htmlUrl: userData.html_url,
        publicRepos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        company: userData.company,
        location: userData.location,
        blog: userData.blog,
      },
      repositories: repos.map((repo: {
        id: number;
        name: string;
        full_name: string;
        description: string | null;
        stargazers_count: number;
        forks_count: number;
        open_issues_count: number;
        language: string | null;
        updated_at: string;
        html_url: string;
        private: boolean;
        default_branch: string;
      }) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        openIssues: repo.open_issues_count,
        language: repo.language,
        updatedAt: repo.updated_at,
        htmlUrl: repo.html_url,
        isPrivate: repo.private,
        defaultBranch: repo.default_branch,
      })),
      events: events.map((ev) => ({
        type: ev.type,
        createdAt: ev.created_at,
        repoName: ev.repo ? ev.repo.name : 'Unknown',
      })),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
