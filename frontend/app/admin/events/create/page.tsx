import CreateEventForm from "@/components/admin/CreateEventForm";

export const metadata = {
    title: "Créer un Événement | Admin | Eventia",
    description: "Créez et publiez de nouveaux événements professionnels sur Eventia.",
};

export default function CreateEventPage() {
    return (
        <div className="px-8 py-6 max-w-7xl mx-auto">
            <CreateEventForm />
        </div>
    );
}
