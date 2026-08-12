import { getFeaturedHomes, type ApiFloorPlan } from "@/lib/api-content";
import HomeClient from "./HomeClient";

// Server wrapper: fetches the featured homes so their cards (a frequent LCP
// element) are in the initial HTML instead of arriving via a client-side API
// call after hydration. ISR keeps the CMS data fresh without a redeploy; a
// runtime CMS failure throws so Next keeps serving the last good page.
export const revalidate = 300;

export default async function Home() {
  const featuredHomes: ApiFloorPlan[] = await getFeaturedHomes();
  return <HomeClient featuredHomes={featuredHomes} />;
}
