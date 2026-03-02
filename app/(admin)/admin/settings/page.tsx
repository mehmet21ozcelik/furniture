import { getSettingsAction } from "./actions";
import { SettingsForm } from "./SettingsForm";

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
    const settings = await getSettingsAction();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-gray-900">Site Ayarları</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <SettingsForm initialSettings={settings} />
            </div>
        </div>
    );
}
