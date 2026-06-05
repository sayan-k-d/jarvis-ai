import { NextResponse } from "next/server";

async function handleProxy(request) {
  const { searchParams } = new URL(request.url);
  const apiParam = searchParams.get("api");

  // 1. Check if the api parameter is provided
  if (!apiParam) {
    return NextResponse.json(
      { message: "Missing 'api' parameter in query." },
      { status: 400 },
    );
  }

  try {
    // 2. Safely resolve upstream base URL matching
    let baseUrlString =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://35.226.245.206:9092/JarvisV3/";
    if (!baseUrlString.endsWith("/")) {
      baseUrlString += "/";
    }

    // Clean up any leading slashes on the parameter to prevent broken target strings (e.g. //)
    const cleanApiPath = apiParam.startsWith("/")
      ? apiParam.slice(1)
      : apiParam;
    const targetUrl = new URL(cleanApiPath, baseUrlString);

    // 3. Append all incoming flat parameters (size, page, keyword) to the target URL
    searchParams.forEach((value, key) => {
      if (key !== "api" && key !== "bodyType") {
        targetUrl.searchParams.append(key, value);
      }
    });

    // 4. Duplicate incoming headers and strip the host to prevent routing collisions
    const headers = new Headers(request.headers);
    headers.delete("host");

    const fetchOptions = {
      method: request.method,
      headers: headers,
    };

    // 5. Handle payload streaming for mutations (POST/PUT/PATCH/DELETE)
    if (!["GET", "HEAD"].includes(request.method)) {
      if (searchParams.get("bodyType") === "form") {
        headers.delete("content-length");
      }
      // Directly pass the standard request stream straight down to fetch
      fetchOptions.body = request.body;
      fetchOptions.duplex = "half";
    }

    // 6. Execute request with an abort timeout loop (5 minutes)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 300000);
    fetchOptions.signal = controller.signal;

    const response = await fetch(targetUrl.toString(), fetchOptions);
    clearTimeout(timeout);

    if (response.status === 403) {
      return NextResponse.json({ message: "403 Forbidden" }, { status: 403 });
    }

    // 7. Stream the final backend payload raw response back to the client browser
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      return NextResponse.json(
        {
          message:
            "504 Gateway Timeout: Upstream server took too long to respond.",
        },
        { status: 504 },
      );
    }
    console.error("[App Proxy Error]:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Export mapping methods to support all inbound browser routing hooks
export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
