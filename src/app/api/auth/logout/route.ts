import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const url = new URL("/login", request.url);
  const response = NextResponse.redirect(url, 303);
  response.cookies.delete("park_auth_token");
  return response;
}

export async function GET(request: Request) {
  const url = new URL("/login", request.url);
  const response = NextResponse.redirect(url, 303);
  response.cookies.delete("park_auth_token");
  return response;
}
