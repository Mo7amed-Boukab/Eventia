import EventDetailsView from "@/components/admin/EventDetailsView";

export const metadata = {
    title: "Détails de l'Événement | Admin | Eventia",
    description: "Consultez les détails complets de votre événement sur le tableau de bord Eventia.",
};

export default function EventDetailsPage() {
    return (
        <div className="px-8 py-8 pb-20">
            <EventDetailsView />
        </div>
    );
}
