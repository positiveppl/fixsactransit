module.exports = [
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
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/vehicles/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
// app/api/vehicles/route.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gtfs$2d$realtime$2d$bindings$2f$gtfs$2d$realtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/gtfs-realtime-bindings/gtfs-realtime.js [app-route] (ecmascript)");
;
;
const { FeedMessage } = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gtfs$2d$realtime$2d$bindings$2f$gtfs$2d$realtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].transit_realtime;
const SACRT_VEHICLES_URL = 'https://bustime.sacrt.com/gtfsrt/vehicles';
async function GET() {
    try {
        const res = await fetch(SACRT_VEHICLES_URL, {
            headers: {
                'User-Agent': 'fixsactransit.org/1.0'
            },
            next: {
                revalidate: 15
            }
        });
        if (!res.ok) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `Feed returned ${res.status}`
            }, {
                status: 502
            });
        }
        const buffer = await res.arrayBuffer();
        const feed = FeedMessage.decode(new Uint8Array(buffer));
        const vehicles = feed.entity.filter((e)=>e.vehicle?.position).map((e)=>({
                id: e.id,
                route_id: e.vehicle?.trip?.routeId ?? '',
                trip_id: e.vehicle?.trip?.tripId ?? '',
                vehicle_id: e.vehicle?.vehicle?.id ?? '',
                vehicle_label: e.vehicle?.vehicle?.label ?? '',
                latitude: e.vehicle.position.latitude,
                longitude: e.vehicle.position.longitude,
                bearing: e.vehicle?.position?.bearing ?? 0,
                speed: e.vehicle?.position?.speed ?? 0,
                timestamp: Number(e.vehicle?.timestamp ?? 0)
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            vehicles,
            fetched_at: new Date().toISOString()
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30'
            }
        });
    } catch (err) {
        console.error('vehicles route error:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch vehicle feed'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__09-g-pu._.js.map