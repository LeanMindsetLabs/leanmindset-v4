import { comingSoonLabs, labCatalog, openLab, starterLab } from "@/src/content/labs";
import ScrollableScreen from "@/src/layout/ScrollableScreen";
import LabHeroCard from "@/src/ui/LabHeroCard";
import LabFlowHeader from "./LabFlowHeader";

export default function LabCatalogScreen() {
  return (
    <ScrollableScreen>
      <LabFlowHeader eyebrow={labCatalog.eyebrow} title={labCatalog.title} />
      <LabHeroCard
        photo={starterLab.photo}
        title={starterLab.name}
        meta={starterLab.meta}
        pitch={starterLab.pitch}
        badge="Start here"
        badgeAccent
        onPress={() => openLab(starterLab.id)}
      />
      {comingSoonLabs.map((offer) => (
        <LabHeroCard
          key={offer.id}
          photo={offer.photo}
          title={offer.name}
          meta={offer.meta}
          pitch={offer.pitch ?? offer.description}
          badge={offer.badge}
          compact
          onPress={() => openLab(offer.id)}
        />
      ))}
    </ScrollableScreen>
  );
}
