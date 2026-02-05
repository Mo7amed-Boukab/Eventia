import EditEventForm from "@/components/admin/EditEventForm";

export const metadata = {
    title: "Modifier l'Événement | Admin | Eventia",
    description: "Modifiez les détails de votre événement sur Eventia.",
};

export default function EditEventPage() {
    return (
        <div className="px-8 py-6 pb-20">
            <EditEventForm />
        </div>
    );
}
