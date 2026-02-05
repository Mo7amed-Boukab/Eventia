import EventsList from "@/components/admin/EventsList";

export const metadata = {
    title: "Gestion des Événements | Admin | Eventia",
    description: "Gérez vos événements professionnels et suivez les participations sur Eventia.",
};

const EventsPage = () => {
    return (
        <div className="px-8 py-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1" style={{ fontFamily: "serif" }}>
                        Gestion des Événements
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Gérez vos événements et suivez les participations.
                    </p>
                </div>
            </div>

            <EventsList />
        </div>
    );
};

export default EventsPage;
