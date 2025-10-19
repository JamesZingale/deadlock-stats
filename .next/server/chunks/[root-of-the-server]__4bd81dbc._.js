module.exports = [
"[project]/.next-internal/server/app/api/fetch-player-match-stats/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/src/app/api/fetch-player-match-stats/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lib/db.ts [app-route] (ecmascript)");
;
const DEADLOCK_API_BASE = 'https://api.deadlock-api.com/v1/sql';
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const matchId = searchParams.get('match_id');
        const accountId = searchParams.get('account_id');
        if (!matchId || !accountId) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Missing match_id or account_id'
            }), {
                status: 400
            });
        }
        const query = encodeURIComponent(`
      SELECT match_id, account_id, hero_id, net_worth, kills, deaths, assists, stats.player_damage,
      stats.player_healing, won, team
      FROM match_player
      WHERE match_id = ${matchId} AND account_id = ${accountId}
    `);
        const url = `${DEADLOCK_API_BASE}?query=${query}`;
        console.log('Fetching:', url);
        const res = await fetch(url);
        if (!res.ok) {
            console.error('Deadlock API fetch failed:', res.status, await res.text());
            throw new Error('Failed to fetch player match stats');
        }
        const stats = await res.json();
        if (!Array.isArray(stats) || stats.length === 0) {
            return new Response(JSON.stringify({
                success: false,
                error: 'No stats found for this player/match'
            }), {
                status: 404
            });
        }
        const player = stats[0];
        console.log('Player object:', JSON.stringify(player, null, 2));
        // Extract final (latest) values from arrays
        const finalDamage = Array.isArray(player['stats.player_damage']) ? player['stats.player_damage'][player['stats.player_damage'].length - 1] : player['stats.player_damage'] ?? 0;
        const finalHealing = Array.isArray(player['stats.player_healing']) ? player['stats.player_healing'][player['stats.player_healing'].length - 1] : player['stats.player_healing'] ?? 0;
        // Upsert into local DB
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].query(`
      INSERT INTO PlayerMatchStats (
        match_id, player_id, hero_id, souls, kills, deaths, assists,
        damage_done, healing_done, result, team
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        hero_id = VALUES(hero_id),
        souls = VALUES(souls),
        kills = VALUES(kills),
        deaths = VALUES(deaths),
        assists = VALUES(assists),
        damage_done = VALUES(damage_done),
        healing_done = VALUES(healing_done),
        result = VALUES(result),
        team = VALUES(team)
      `, [
            player.match_id,
            player.account_id,
            player.hero_id,
            player.net_worth ?? 0,
            player.kills,
            player.deaths,
            player.assists,
            finalDamage,
            finalHealing,
            player.won ? 1 : 0,
            player.team ?? null
        ]);
        return new Response(JSON.stringify({
            success: true,
            player
        }), {
            status: 200
        });
    } catch (err) {
        console.error('Error in fetch-player-match-stats:', err);
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

//# sourceMappingURL=%5Broot-of-the-server%5D__4bd81dbc._.js.map