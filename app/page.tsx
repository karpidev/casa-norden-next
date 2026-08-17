import { getHomeGlobal, normalizeHomeData } from '@/lib/payload';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedMemoriesSection } from '@/components/home/FeaturedMemoriesSection';
import { AboutSection } from '@/components/home/AboutSection';
import { PlacesSection } from '@/components/home/PlacesSection';
import { MoreFeaturedSection } from '@/components/home/MoreFeaturedSection';
import { CtaHistorySection } from '@/components/home/CtaHistorySection';

export default async function Home() {
  const rawData = await getHomeGlobal();
  const data = normalizeHomeData(rawData);

  return (
    <main>
      <HeroSection {...data.hero} />
      <FeaturedMemoriesSection {...data.featuredMemories} />
      <AboutSection {...data.about} />
      <PlacesSection {...data.places} />
      <MoreFeaturedSection {...data.moreFeatured} />
      <CtaHistorySection {...data.cta} />
    </main>
  );
}
