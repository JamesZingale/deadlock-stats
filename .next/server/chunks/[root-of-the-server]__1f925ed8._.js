module.exports = [
"[project]/.next-internal/server/app/api/fetch-players/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/timers [external] (timers, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("timers", () => require("timers"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/src/app/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mysql2/promise.js [app-route] (ecmascript)");
;
const db = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root1',
    database: process.env.DB_NAME || 'deadlock_stats',
    port: Number(process.env.DB_PORT) || 3306
});
}),
"[project]/src/app/api/fetch-players/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lib/db.ts [app-route] (ecmascript)");
;
const DEADLOCK_API_BASE = 'https://api.deadlock-api.com';
async function GET() {
    try {
        // Step 1: Get active matches
        const matchesRes = await fetch(`${DEADLOCK_API_BASE}/v1/matches/active`);
        if (!matchesRes.ok) {
            console.error('Failed to fetch active matches:', matchesRes.status);
            throw new Error('Failed to fetch active matches');
        }
        const matches = await matchesRes.json();
        // Step 2: Collect up to 12 unique account IDs
        const accountIds = new Set();
        for (const match of matches){
            if (match.players) {
                for (const p of match.players){
                    if (p.account_id) accountIds.add(p.account_id);
                    if (accountIds.size >= 12) break;
                }
            }
            if (accountIds.size >= 12) break;
        }
        const accountIdList = Array.from(accountIds);
        if (accountIdList.length === 0) {
            throw new Error('No player IDs found');
        }
        console.log(`Found ${accountIdList.length} player IDs:`, accountIdList);
        // Step 3: Fetch hero stats for all IDs
        const heroStatsUrl = `${DEADLOCK_API_BASE}/v1/players/hero-stats?account_ids=${accountIdList.join(',')}`;
        console.log('Fetching hero stats:', heroStatsUrl);
        const heroStatsRes = await fetch(heroStatsUrl);
        if (!heroStatsRes.ok) {
            console.error('Hero stats fetch failed:', heroStatsRes.status, await heroStatsRes.text());
            throw new Error('Failed to fetch hero stats');
        }
        const heroStats = await heroStatsRes.json();
        // Step 4: Fetch Steam profiles for all IDs
        const steamUrl = `${DEADLOCK_API_BASE}/v1/players/steam?account_ids=${accountIdList.join(',')}`;
        console.log('Fetching steam profiles:', steamUrl);
        const steamRes = await fetch(steamUrl);
        const steamProfiles = steamRes.ok ? await steamRes.json() : [];
        // Step 5: Map Steam usernames by ID
        const usernameMap = {};
        for (const profile of steamProfiles){
            usernameMap[profile.account_id] = profile.personaname || 'Unknown';
        }
        // Step 6: Aggregate stats and upsert into DB
        const groupedStats = {};
        for (const hero of heroStats){
            const id = hero.account_id;
            if (!groupedStats[id]) groupedStats[id] = {
                matches: 0,
                wins: 0
            };
            groupedStats[id].matches += hero.matches_played || 0;
            groupedStats[id].wins += hero.wins || 0;
        }
        for (const [idStr, stats] of Object.entries(groupedStats)){
            const accountId = Number(idStr);
            const totalMatches = stats.matches;
            const totalWins = stats.wins;
            const totalLosses = totalMatches - totalWins;
            const username = usernameMap[accountId] || 'Unknown';
            console.log(`Inserting/updating player ${accountId}: ${username}`);
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].query(`INSERT INTO Players (player_id, username, total_matches_played, total_wins, total_losses)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           username = VALUES(username),
           total_matches_played = VALUES(total_matches_played),
           total_wins = VALUES(total_wins),
           total_losses = VALUES(total_losses)`, [
                accountId,
                username,
                totalMatches,
                totalWins,
                totalLosses
            ]);
        }
        return new Response(JSON.stringify({
            success: true,
            count: Object.keys(groupedStats).length
        }), {
            status: 200
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({
            success: false,
            error: err.message
        }), {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1f925ed8._.js.map