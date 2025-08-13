import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(["/sign-in(.*)","/sign-up(.*)", "/api/users"])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})


// const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

// export default clerkMiddleware((auth, req) => {
//   // if (isPublicRoute(req)) {
//   //   return Response.redirect(new URL("/dashboard", req.url));
//   // }
//   // console.log("Middleware running, auth:", auth()); // Debug auth
//   //  console.log("Middleware running, auth:", auth().userId)
//   // return NextResponse.next();
// });




export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
  //  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}




