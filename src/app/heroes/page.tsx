import Image from "next/image";
import { db } from "../lib/db";

export const dynamic = "force-dynamic";

export default async function HeroesPage() {
  const [heroes] = await db.query(
    `SELECT hero_id, hero_name, role, max_health
     FROM Heroes
     WHERE hero_id IN (1,2,3,4,6,7,8,10,11,12,13,14,15,16,17,18,19,20,25,27,31,35,50,52,58,60)
     ORDER BY hero_id ASC`
  ) as any;

  return (
    <div className="w-full min-h-screen px-8 py-10">
      <h1 className="text-4xl font-bold mb-8">Heroes</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {heroes.map((hero: any) => {
          const iconPath = `/hero-icons/${hero.hero_name}.png`;

          return (
            <div
              key={hero.hero_id}
              className="border rounded-lg p-4 shadow-md bg-white"
            >
              <div className="w-full flex justify-center mb-4">
                <Image
                  src={iconPath}
                  alt={hero.hero_name}
                  width={128}
                  height={128}
                />
              </div>

              <h2 className="text-xl font-semibold">{hero.hero_name}</h2>

              <p className="text-gray-700 mt-2">
                <strong>Role:</strong> {hero.role || "Unknown"}
              </p>

              <p className="text-gray-700">
                <strong>Health:</strong> {hero.max_health ?? "N/A"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
