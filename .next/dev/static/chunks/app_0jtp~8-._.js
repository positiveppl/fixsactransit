(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/components/Nav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Nav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function Nav() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 32px',
            borderBottom: '1px solid #e5e5e5',
            position: 'sticky',
            top: 0,
            background: '#ffffff',
            zIndex: 50
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontFamily: 'Arial Black, Impact, ui-sans-serif',
                    fontSize: 15,
                    fontWeight: 900,
                    letterSpacing: '0.06em',
                    color: '#202020',
                    textTransform: 'uppercase'
                },
                children: "Elastic City"
            }, void 0, false, {
                fileName: "[project]/app/components/Nav.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 14,
                            color: '#646464',
                            textDecoration: 'underline dotted #bbbbbb',
                            textUnderlineOffset: 3,
                            cursor: 'pointer'
                        },
                        children: "Sacramento, CA"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Nav.tsx",
                        lineNumber: 14,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            background: '#2b9a66',
                            color: '#fff',
                            fontSize: 12,
                            fontWeight: 600,
                            padding: '4px 14px',
                            borderRadius: 9999
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pulse",
                                style: {
                                    width: 5,
                                    height: 5,
                                    background: '#fff',
                                    borderRadius: '50%'
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/components/Nav.tsx",
                                lineNumber: 22,
                                columnNumber: 11
                            }, this),
                            "SacRT Live"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Nav.tsx",
                        lineNumber: 17,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Nav.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Nav.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = Nav;
var _c;
__turbopack_context__.k.register(_c, "Nav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_BASE",
    ()=>API_BASE,
    "fetchAllScores",
    ()=>fetchAllScores,
    "fetchCityScore",
    ()=>fetchCityScore,
    "fmtMin",
    ()=>fmtMin,
    "getPainColor",
    ()=>getPainColor,
    "getPainLabel",
    ()=>getPainLabel
]);
const API_BASE = 'https://api-gateway.msgpnn.workers.dev';
async function fetchAllScores() {
    const res = await fetch(`${API_BASE}/api/scores`, {
        next: {
            revalidate: 300
        }
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}
async function fetchCityScore(cityId) {
    const res = await fetch(`${API_BASE}/api/scores/${cityId}`, {
        next: {
            revalidate: 300
        }
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}
function fmtMin(min) {
    if (!min) return '—';
    if (min < 60) return `${min}m`;
    return `${Math.floor(min / 60)}h ${min % 60}m`;
}
function getPainLabel(pain) {
    if (pain >= 7) return 'Brutal';
    if (pain >= 5) return 'Painful';
    if (pain >= 3) return 'Bad';
    if (pain >= 2) return 'Mediocre';
    return 'Acceptable';
}
function getPainColor(pain) {
    if (pain >= 6) return '#ea2804';
    if (pain >= 4) return '#dd4425';
    if (pain >= 2) return '#646464';
    return '#2b9a66';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/Hero.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Hero
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/api.ts [app-client] (ecmascript)");
'use client';
;
;
function Hero({ sac }) {
    const transitMin = sac?.transit_minutes ?? 100;
    const driveMin = sac?.drive_minutes ?? 15;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        style: {
            background: 'linear-gradient(135deg, #ea2804 0%, #cc1a00 20%, #a01060 50%, #d02080 75%, #ff6090 100%)',
            padding: '80px 32px 96px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.07) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(255,200,0,0.08) 0%, transparent 50%)'
                }
            }, void 0, false, {
                fileName: "[project]/app/components/Hero.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: 12,
                    fontFamily: 'JetBrains Mono, monospace',
                    letterSpacing: '0.12em',
                    padding: '6px 18px',
                    borderRadius: 9999,
                    marginBottom: 32,
                    textTransform: 'uppercase',
                    position: 'relative'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pulse",
                        style: {
                            width: 5,
                            height: 5,
                            background: '#fff',
                            borderRadius: '50%'
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/components/Hero.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this),
                    "Sacramento Regional Transit · Real-Time Analysis"
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Hero.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                style: {
                    fontFamily: 'Arial Black, Impact, ui-sans-serif',
                    fontSize: 'clamp(52px, 9vw, 96px)',
                    fontWeight: 900,
                    color: '#fff',
                    lineHeight: 0.95,
                    letterSpacing: '-0.02em',
                    textTransform: 'uppercase',
                    marginBottom: 24,
                    position: 'relative'
                },
                children: [
                    "The Capital",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/app/components/Hero.tsx",
                        lineNumber: 36,
                        columnNumber: 20
                    }, this),
                    "Can't Move."
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Hero.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    fontSize: 'clamp(16px, 2.5vw, 22px)',
                    color: 'rgba(255,255,255,0.85)',
                    maxWidth: 640,
                    margin: '0 auto 40px',
                    lineHeight: 1.5,
                    position: 'relative'
                },
                children: [
                    "Sacramento is the capital of the 5th largest economy on Earth. A ",
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fmtMin"])(driveMin),
                    " drive is currently ",
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fmtMin"])(transitMin),
                    " by transit. We built a tool to make that impossible to ignore."
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Hero.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    flexWrap: 'wrap',
                    position: 'relative'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "#trip-planner",
                        style: {
                            background: '#202020',
                            color: '#fcfcfc',
                            fontSize: 15,
                            fontWeight: 600,
                            padding: '12px 28px',
                            borderRadius: 9999,
                            border: 'none',
                            cursor: 'pointer',
                            outline: '4px solid #202020',
                            textDecoration: 'none',
                            display: 'inline-block'
                        },
                        children: "Calculate Yours"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Hero.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "#cities",
                        style: {
                            background: '#ffffff',
                            color: '#202020',
                            fontSize: 15,
                            fontWeight: 600,
                            padding: '12px 28px',
                            borderRadius: 9999,
                            border: '1px solid #202020',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            display: 'inline-block'
                        },
                        children: "Compare Cities"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Hero.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Hero.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Hero.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_c = Hero;
var _c;
__turbopack_context__.k.register(_c, "Hero");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/StatStrip.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StatStrip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/api.ts [app-client] (ecmascript)");
'use client';
;
;
function StatStrip({ sac }) {
    const stats = [
        {
            label: 'Pain Factor',
            value: `${sac?.pain_factor ?? 6.6}×`,
            color: '#ea2804',
            sub: 'slower than driving'
        },
        {
            label: 'Transit Time',
            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fmtMin"])(sac?.transit_minutes ?? 100),
            color: '#202020',
            sub: `${sac?.transfers ?? 1} transfer · ${sac?.walk_minutes ?? 11} min walk`
        },
        {
            label: 'Drive Time',
            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fmtMin"])(sac?.drive_minutes ?? 15),
            color: '#2b9a66',
            sub: 'same trip, by car'
        },
        {
            label: 'Time Waiting',
            value: `${sac?.wait_pct ?? 41}%`,
            color: '#202020',
            sub: 'of the trip is standing still'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            borderBottom: '1px solid #e5e5e5'
        },
        children: stats.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '28px 32px',
                    borderRight: i < stats.length - 1 ? '1px solid #e5e5e5' : 'none'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 11,
                            color: '#8d8d8d',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            marginBottom: 8,
                            fontFamily: 'JetBrains Mono, monospace'
                        },
                        children: s.label
                    }, void 0, false, {
                        fileName: "[project]/app/components/StatStrip.tsx",
                        lineNumber: 22,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontFamily: 'Arial Black, Impact, ui-sans-serif',
                            fontSize: 'clamp(32px, 4vw, 52px)',
                            fontWeight: 900,
                            lineHeight: 1,
                            color: s.color
                        },
                        children: s.value
                    }, void 0, false, {
                        fileName: "[project]/app/components/StatStrip.tsx",
                        lineNumber: 25,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12,
                            color: '#8d8d8d',
                            marginTop: 6
                        },
                        children: s.sub
                    }, void 0, false, {
                        fileName: "[project]/app/components/StatStrip.tsx",
                        lineNumber: 28,
                        columnNumber: 11
                    }, this)
                ]
            }, s.label, true, {
                fileName: "[project]/app/components/StatStrip.tsx",
                lineNumber: 18,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/app/components/StatStrip.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = StatStrip;
var _c;
__turbopack_context__.k.register(_c, "StatStrip");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/TransitCanvas.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TransitCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const ROUTES = [
    {
        id: '1',
        pts: [
            [
                0.05,
                0.28
            ],
            [
                0.95,
                0.28
            ]
        ],
        buses: 5,
        color: '#ea2804'
    },
    {
        id: '30',
        pts: [
            [
                0.05,
                0.43
            ],
            [
                0.95,
                0.43
            ]
        ],
        buses: 4,
        color: '#ea2804'
    },
    {
        id: '51',
        pts: [
            [
                0.05,
                0.57
            ],
            [
                0.95,
                0.57
            ]
        ],
        buses: 3,
        color: '#ea2804'
    },
    {
        id: '62',
        pts: [
            [
                0.05,
                0.72
            ],
            [
                0.95,
                0.72
            ]
        ],
        buses: 4,
        color: '#ea2804'
    },
    {
        id: '13',
        pts: [
            [
                0.28,
                0.05
            ],
            [
                0.28,
                0.95
            ]
        ],
        buses: 3,
        color: '#ea2804'
    },
    {
        id: '23',
        pts: [
            [
                0.52,
                0.05
            ],
            [
                0.52,
                0.95
            ]
        ],
        buses: 4,
        color: '#ea2804'
    },
    {
        id: '15',
        pts: [
            [
                0.74,
                0.05
            ],
            [
                0.74,
                0.95
            ]
        ],
        buses: 3,
        color: '#ea2804'
    }
];
const RAIL = [
    {
        label: 'Gold Line',
        pts: [
            [
                0.04,
                0.18
            ],
            [
                0.96,
                0.18
            ]
        ],
        trains: 2
    },
    {
        label: 'Blue Line',
        pts: [
            [
                0.22,
                0.04
            ],
            [
                0.68,
                0.96
            ]
        ],
        trains: 2
    }
];
function TransitCanvas() {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const countRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const animRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TransitCanvas.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let buses = [], trains = [], t = 0;
            function size() {
                if (!canvas) return;
                canvas.width = canvas.parentElement.getBoundingClientRect().width;
                canvas.height = 380;
            }
            function init() {
                buses = [];
                trains = [];
                ROUTES.forEach({
                    "TransitCanvas.useEffect.init": (r)=>{
                        for(let i = 0; i < r.buses; i++)buses.push({
                            route: r,
                            p: Math.random(),
                            speed: 0.00035 + Math.random() * 0.00025,
                            dir: Math.random() > 0.5 ? 1 : -1,
                            lag: Math.random() > 0.75 ? 0.35 + Math.random() * 0.4 : 1
                        });
                    }
                }["TransitCanvas.useEffect.init"]);
                RAIL.forEach({
                    "TransitCanvas.useEffect.init": (l)=>{
                        for(let i = 0; i < l.trains; i++)trains.push({
                            line: l,
                            p: Math.random(),
                            speed: 0.0007 + Math.random() * 0.0004,
                            dir: Math.random() > 0.5 ? 1 : -1
                        });
                    }
                }["TransitCanvas.useEffect.init"]);
            }
            function lerp(a, b, p) {
                return a + (b - a) * p;
            }
            function getPt(pts, p, w, h) {
                return {
                    x: lerp(pts[0][0], pts[pts.length - 1][0], p) * w,
                    y: lerp(pts[0][1], pts[pts.length - 1][1], p) * h
                };
            }
            function draw() {
                if (!canvas) return;
                const w = canvas.width, h = canvas.height;
                t++;
                ctx.clearRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(0,0,0,0.04)';
                ctx.lineWidth = 0.5;
                for(let x = 0; x < w; x += w / 14){
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, h);
                    ctx.stroke();
                }
                for(let y = 0; y < h; y += h / 8){
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(w, y);
                    ctx.stroke();
                }
                ctx.save();
                RAIL.forEach({
                    "TransitCanvas.useEffect.draw": (l)=>{
                        ctx.setLineDash([
                            5,
                            9
                        ]);
                        ctx.strokeStyle = 'rgba(0,0,0,0.12)';
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.moveTo(l.pts[0][0] * w, l.pts[0][1] * h);
                        ctx.lineTo(l.pts[1][0] * w, l.pts[1][1] * h);
                        ctx.stroke();
                    }
                }["TransitCanvas.useEffect.draw"]);
                ctx.restore();
                ctx.setLineDash([]);
                ROUTES.forEach({
                    "TransitCanvas.useEffect.draw": (r)=>{
                        ctx.strokeStyle = 'rgba(234,40,4,0.07)';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(r.pts[0][0] * w, r.pts[0][1] * h);
                        ctx.lineTo(r.pts[1][0] * w, r.pts[1][1] * h);
                        ctx.stroke();
                    }
                }["TransitCanvas.useEffect.draw"]);
                ctx.save();
                ctx.fillStyle = 'rgba(0,0,0,0.055)';
                ctx.font = 'bold 12px JetBrains Mono, monospace';
                ctx.textAlign = 'center';
                ctx.fillText('RAIL POSITION UNKNOWN', w / 2, h / 2 - 8);
                ctx.font = '10px JetBrains Mono, monospace';
                ctx.fillStyle = 'rgba(0,0,0,0.04)';
                ctx.fillText('NO PUBLIC REAL-TIME FEED', w / 2, h / 2 + 10);
                ctx.restore();
                trains.forEach({
                    "TransitCanvas.useEffect.draw": (tr)=>{
                        const pt = getPt(tr.line.pts, tr.p, w, h);
                        const r2 = 5 + Math.sin(t * 0.025 + tr.p * 8) * 2;
                        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
                        ctx.lineWidth = 0.75;
                        ctx.setLineDash([]);
                        ctx.beginPath();
                        ctx.arc(pt.x, pt.y, r2, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }["TransitCanvas.useEffect.draw"]);
                buses.forEach({
                    "TransitCanvas.useEffect.draw": (b)=>{
                        const pt = getPt(b.route.pts, b.p, w, h);
                        const grd = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 9);
                        grd.addColorStop(0, 'rgba(234,40,4,0.18)');
                        grd.addColorStop(1, 'rgba(234,40,4,0)');
                        ctx.fillStyle = grd;
                        ctx.beginPath();
                        ctx.arc(pt.x, pt.y, 9, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.fillStyle = b.route.color;
                        ctx.beginPath();
                        ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }["TransitCanvas.useEffect.draw"]);
                buses.forEach({
                    "TransitCanvas.useEffect.draw": (b)=>{
                        b.p += b.speed * b.lag * b.dir;
                        if (b.p > 1) {
                            b.p = 1;
                            b.dir = -1;
                        }
                        if (b.p < 0) {
                            b.p = 0;
                            b.dir = 1;
                        }
                    }
                }["TransitCanvas.useEffect.draw"]);
                trains.forEach({
                    "TransitCanvas.useEffect.draw": (tr)=>{
                        tr.p += tr.speed * tr.dir;
                        if (tr.p > 1) {
                            tr.p = 1;
                            tr.dir = -1;
                        }
                        if (tr.p < 0) {
                            tr.p = 0;
                            tr.dir = 1;
                        }
                    }
                }["TransitCanvas.useEffect.draw"]);
                if (countRef.current) countRef.current.textContent = `${buses.length} buses active · ${trains.length} rail (est.)`;
                animRef.current = requestAnimationFrame(draw);
            }
            size();
            init();
            draw();
            const onResize = {
                "TransitCanvas.useEffect.onResize": ()=>{
                    size();
                    init();
                }
            }["TransitCanvas.useEffect.onResize"];
            window.addEventListener('resize', onResize);
            const interval = setInterval(init, 15000);
            return ({
                "TransitCanvas.useEffect": ()=>{
                    cancelAnimationFrame(animRef.current);
                    window.removeEventListener('resize', onResize);
                    clearInterval(interval);
                }
            })["TransitCanvas.useEffect"];
        }
    }["TransitCanvas.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            border: '1px solid #202020',
            borderRadius: 24,
            overflow: 'hidden',
            background: '#fff'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderBottom: '1px solid #e5e5e5'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 13,
                            fontWeight: 600,
                            color: '#202020',
                            fontFamily: 'JetBrains Mono, monospace',
                            letterSpacing: '0.04em'
                        },
                        children: "sacrt_live_feed.js"
                    }, void 0, false, {
                        fileName: "[project]/app/components/TransitCanvas.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: 8
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 5,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    padding: '3px 12px',
                                    borderRadius: 9999,
                                    background: '#2b9a66',
                                    color: '#fff',
                                    fontFamily: 'JetBrains Mono, monospace'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pulse",
                                        style: {
                                            width: 5,
                                            height: 5,
                                            background: '#fff',
                                            borderRadius: '50%'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/TransitCanvas.tsx",
                                        lineNumber: 128,
                                        columnNumber: 13
                                    }, this),
                                    "Buses tracked"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/TransitCanvas.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    fontSize: 11,
                                    fontWeight: 600,
                                    padding: '3px 12px',
                                    borderRadius: 9999,
                                    border: '1px solid #bbbbbb',
                                    color: '#bbbbbb',
                                    fontFamily: 'JetBrains Mono, monospace'
                                },
                                children: "Rail: no feed"
                            }, void 0, false, {
                                fileName: "[project]/app/components/TransitCanvas.tsx",
                                lineNumber: 131,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/TransitCanvas.tsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/TransitCanvas.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                style: {
                    width: '100%',
                    height: 380,
                    display: 'block',
                    background: '#fafafa'
                }
            }, void 0, false, {
                fileName: "[project]/app/components/TransitCanvas.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: 20,
                    padding: '0 20px 14px'
                },
                children: [
                    {
                        type: 'dot',
                        color: '#ea2804',
                        label: 'Bus (GPS)'
                    },
                    {
                        type: 'dash',
                        label: 'Light Rail (schedule est.)'
                    },
                    {
                        type: 'dot',
                        color: '#e5e5e5',
                        border: '1px solid #ccc',
                        label: 'Ghost (no data)'
                    }
                ].map((l, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 7,
                            fontSize: 11,
                            color: '#646464',
                            fontFamily: 'JetBrains Mono, monospace'
                        },
                        children: [
                            l.type === 'dot' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 7,
                                    height: 7,
                                    borderRadius: '50%',
                                    background: l.color,
                                    border: l.border,
                                    flexShrink: 0
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/components/TransitCanvas.tsx",
                                lineNumber: 149,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 20,
                                    height: 0,
                                    borderTop: '1.5px dashed #bbbbbb',
                                    flexShrink: 0
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/components/TransitCanvas.tsx",
                                lineNumber: 150,
                                columnNumber: 17
                            }, this),
                            l.label
                        ]
                    }, i, true, {
                        fileName: "[project]/app/components/TransitCanvas.tsx",
                        lineNumber: 147,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/components/TransitCanvas.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '14px 20px',
                    borderTop: '1px solid #e5e5e5',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        ref: countRef,
                        style: {
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 11,
                            color: '#8d8d8d'
                        },
                        children: "— buses active"
                    }, void 0, false, {
                        fileName: "[project]/app/components/TransitCanvas.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 11,
                            color: '#8d8d8d'
                        },
                        children: "Updates every 15s"
                    }, void 0, false, {
                        fileName: "[project]/app/components/TransitCanvas.tsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/TransitCanvas.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/TransitCanvas.tsx",
        lineNumber: 120,
        columnNumber: 5
    }, this);
}
_s(TransitCanvas, "UCleKtJ9vZOuRzArBXV36dU2U9k=");
_c = TransitCanvas;
var _c;
__turbopack_context__.k.register(_c, "TransitCanvas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/CodeBlock.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CodeBlock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function CodeBlock({ sac }) {
    const transit = sac?.transit_minutes ?? 100;
    const drive = sac?.drive_minutes ?? 15;
    const wait = sac?.wait_minutes ?? 41;
    const pain = sac?.pain_factor ?? 6.6;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            marginTop: 16,
            background: '#24292e',
            borderRadius: 20,
            overflow: 'hidden',
            border: '1px solid #202020'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '12px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: 6
                        },
                        children: [
                            '#ff5f57',
                            '#febc2e',
                            '#28c840'
                        ].map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    background: c
                                }
                            }, c, false, {
                                fileName: "[project]/app/components/CodeBlock.tsx",
                                lineNumber: 14,
                                columnNumber: 53
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 13,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 12,
                            color: 'rgba(255,255,255,0.5)',
                            letterSpacing: '0.04em'
                        },
                        children: "pain_factor.js"
                    }, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 16,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/CodeBlock.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '20px 24px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: '#e8e8e8',
                    overflowX: 'auto'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: '#6a737d'
                        },
                        children: "// Transit Reality Calculator — Sacramento"
                    }, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 19,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 19,
                        columnNumber: 93
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: '#79b8ff'
                        },
                        children: "const"
                    }, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 20,
                        columnNumber: 9
                    }, this),
                    " trip = ",
                    '{',
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 20,
                        columnNumber: 69
                    }, this),
                    "  ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: '#9ecbff'
                        },
                        children: "origin"
                    }, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 21,
                        columnNumber: 21
                    }, this),
                    ": ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: '#f97583'
                        },
                        children: '"Oak Park, Sacramento"'
                    }, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 21,
                        columnNumber: 71
                    }, this),
                    ",",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 21,
                        columnNumber: 136
                    }, this),
                    "  ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: '#9ecbff'
                        },
                        children: "destination"
                    }, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 22,
                        columnNumber: 21
                    }, this),
                    ": ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: '#f97583'
                        },
                        children: '"Downtown Sacramento"'
                    }, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 22,
                        columnNumber: 76
                    }, this),
                    ",",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 22,
                        columnNumber: 140
                    }, this),
                    "  ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: '#9ecbff'
                        },
                        children: "transit_minutes"
                    }, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 23,
                        columnNumber: 21
                    }, this),
                    ": ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: '#f8e045'
                        },
                        children: transit
                    }, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 23,
                        columnNumber: 80
                    }, this),
                    ",",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 23,
                        columnNumber: 132
                    }, this),
                    "  ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: '#9ecbff'
                        },
                        children: "drive_minutes"
                    }, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 24,
                        columnNumber: 21
                    }, this),
                    ": ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: '#f8e045'
                        },
                        children: drive
                    }, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 24,
                        columnNumber: 78
                    }, this),
                    ",",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 24,
                        columnNumber: 128
                    }, this),
                    "  ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: '#9ecbff'
                        },
                        children: "wait_minutes"
                    }, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 25,
                        columnNumber: 21
                    }, this),
                    ": ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: '#f8e045'
                        },
                        children: wait
                    }, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 25,
                        columnNumber: 77
                    }, this),
                    ",",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 25,
                        columnNumber: 126
                    }, this),
                    '}',
                    ";",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 26,
                        columnNumber: 15
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 26,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: '#6a737d'
                        },
                        children: "// The number that says everything"
                    }, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 27,
                        columnNumber: 85
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: '#79b8ff'
                        },
                        children: "const"
                    }, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this),
                    " painFactor = trip.",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: '#9ecbff'
                        },
                        children: "transit_minutes"
                    }, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 28,
                        columnNumber: 75
                    }, this),
                    " / trip.",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: '#9ecbff'
                        },
                        children: "drive_minutes"
                    }, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 28,
                        columnNumber: 140
                    }, this),
                    ";",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 28,
                        columnNumber: 196
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: '#6a737d'
                        },
                        children: [
                            "// → ",
                            pain,
                            " (We are the capital of California.)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/CodeBlock.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/CodeBlock.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/CodeBlock.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = CodeBlock;
var _c;
__turbopack_context__.k.register(_c, "CodeBlock");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/Sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const STATIC_CITIES = [
    {
        name: 'Washington DC',
        score: 9.4,
        pct: 95,
        color: '#202020'
    },
    {
        name: 'Portland',
        score: 7.9,
        pct: 80,
        color: '#202020'
    },
    {
        name: 'Denver',
        score: 7.1,
        pct: 72,
        color: '#202020'
    },
    {
        name: 'Phoenix',
        score: 5.4,
        pct: 54,
        color: '#8d8d8d'
    }
];
const INIT_DEPS = [
    {
        route: '51',
        dest: 'Freeport & Sutterville',
        min: 4
    },
    {
        route: '23',
        dest: 'Broadway & Land Park Dr',
        min: 8
    },
    {
        route: '30',
        dest: 'Stockton Blvd & Fruitridge',
        min: 21
    },
    {
        route: '51',
        dest: 'Freeport & Sutterville',
        min: 36
    }
];
function Sidebar({ sac, allCities }) {
    _s();
    const [animated, setAnimated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [deps, setDeps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(INIT_DEPS);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Sidebar.useEffect": ()=>{
            setTimeout({
                "Sidebar.useEffect": ()=>setAnimated(true)
            }["Sidebar.useEffect"], 300);
            const iv = setInterval({
                "Sidebar.useEffect.iv": ()=>{
                    setDeps({
                        "Sidebar.useEffect.iv": (d)=>d.map({
                                "Sidebar.useEffect.iv": (dep)=>({
                                        ...dep,
                                        min: dep.min <= 0 ? 20 + Math.floor(Math.random() * 25) : dep.min - 1
                                    })
                            }["Sidebar.useEffect.iv"])
                    }["Sidebar.useEffect.iv"]);
                }
            }["Sidebar.useEffect.iv"], 60000);
            return ({
                "Sidebar.useEffect": ()=>clearInterval(iv)
            })["Sidebar.useEffect"];
        }
    }["Sidebar.useEffect"], []);
    const sacScore = sac?.score ? parseFloat(sac.score) : 2.8;
    const sacPct = sacScore / 10 * 100;
    // Merge live city data where available
    const cityRows = STATIC_CITIES.map((c)=>{
        const live = allCities.find((a)=>a.name === c.name);
        return live?.score ? {
            ...c,
            score: parseFloat(live.score),
            pct: parseFloat(live.score) / 10 * 100
        } : c;
    });
    const cardStyle = {
        border: '1px solid #202020',
        borderRadius: 20,
        overflow: 'hidden'
    };
    const headStyle = {
        padding: '14px 18px',
        borderBottom: '1px solid #e5e5e5',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };
    const titleStyle = {
        fontSize: 12,
        fontFamily: 'JetBrains Mono, monospace',
        color: '#646464',
        letterSpacing: '0.06em',
        textTransform: 'uppercase'
    };
    const bodyStyle = {
        padding: 18
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 16
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: cardStyle,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: headStyle,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: titleStyle,
                                children: "Pain Factor"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Sidebar.tsx",
                                lineNumber: 51,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'inline-flex',
                                    fontSize: 11,
                                    fontWeight: 600,
                                    padding: '3px 12px',
                                    borderRadius: 9999,
                                    border: '1px solid #ea2804',
                                    color: '#ea2804',
                                    fontFamily: 'JetBrains Mono, monospace'
                                },
                                children: "SACRT"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Sidebar.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Sidebar.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: bodyStyle,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontFamily: 'Arial Black, Impact, ui-sans-serif',
                                    fontSize: 80,
                                    fontWeight: 900,
                                    lineHeight: 1,
                                    color: '#ea2804'
                                },
                                children: [
                                    sac?.pain_factor ?? 6.6,
                                    "×"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Sidebar.tsx",
                                lineNumber: 55,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 10,
                                    fontSize: 13,
                                    color: '#646464',
                                    lineHeight: 1.6,
                                    borderLeft: '3px solid #ea2804',
                                    paddingLeft: 12
                                },
                                children: [
                                    "A ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fmtMin"])(sac?.drive_minutes ?? 15),
                                    " drive is currently ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fmtMin"])(sac?.transit_minutes ?? 100),
                                    " by transit.",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/app/components/Sidebar.tsx",
                                        lineNumber: 59,
                                        columnNumber: 118
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/app/components/Sidebar.tsx",
                                        lineNumber: 59,
                                        columnNumber: 124
                                    }, this),
                                    "You will spend ",
                                    sac?.wait_minutes ?? 41,
                                    " of those minutes not riding — just waiting."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Sidebar.tsx",
                                lineNumber: 58,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Sidebar.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Sidebar.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: cardStyle,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: headStyle,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: titleStyle,
                            children: "Trip Breakdown"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Sidebar.tsx",
                            lineNumber: 67,
                            columnNumber: 32
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/Sidebar.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: bodyStyle,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 1,
                                    background: '#e5e5e5',
                                    borderRadius: 12,
                                    overflow: 'hidden',
                                    marginBottom: 16
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: '#fff',
                                            padding: '14px 16px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 10,
                                                    color: '#8d8d8d',
                                                    fontFamily: 'JetBrains Mono, monospace',
                                                    letterSpacing: '0.08em',
                                                    textTransform: 'uppercase',
                                                    marginBottom: 4
                                                },
                                                children: "Transit"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Sidebar.tsx",
                                                lineNumber: 71,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontFamily: 'Arial Black, Impact, ui-sans-serif',
                                                    fontSize: 30,
                                                    fontWeight: 900,
                                                    lineHeight: 1,
                                                    color: '#ea2804'
                                                },
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fmtMin"])(sac?.transit_minutes ?? 100)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Sidebar.tsx",
                                                lineNumber: 72,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Sidebar.tsx",
                                        lineNumber: 70,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: '#fff',
                                            padding: '14px 16px',
                                            borderLeft: '1px solid #e5e5e5'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 10,
                                                    color: '#8d8d8d',
                                                    fontFamily: 'JetBrains Mono, monospace',
                                                    letterSpacing: '0.08em',
                                                    textTransform: 'uppercase',
                                                    marginBottom: 4
                                                },
                                                children: "Driving"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Sidebar.tsx",
                                                lineNumber: 75,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontFamily: 'Arial Black, Impact, ui-sans-serif',
                                                    fontSize: 30,
                                                    fontWeight: 900,
                                                    lineHeight: 1,
                                                    color: '#2b9a66'
                                                },
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fmtMin"])(sac?.drive_minutes ?? 15)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Sidebar.tsx",
                                                lineNumber: 76,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Sidebar.tsx",
                                        lineNumber: 74,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Sidebar.tsx",
                                lineNumber: 69,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: 10
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: 11,
                                            color: '#8d8d8d',
                                            fontFamily: 'JetBrains Mono, monospace',
                                            marginBottom: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Time waiting at stops"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Sidebar.tsx",
                                                lineNumber: 81,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                style: {
                                                    color: '#ea2804'
                                                },
                                                children: [
                                                    sac?.wait_pct ?? 41,
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/Sidebar.tsx",
                                                lineNumber: 82,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Sidebar.tsx",
                                        lineNumber: 80,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            height: 3,
                                            background: '#e5e5e5',
                                            borderRadius: 9999,
                                            overflow: 'hidden'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                height: '100%',
                                                background: '#ea2804',
                                                borderRadius: 9999,
                                                width: animated ? `${sac?.wait_pct ?? 41}%` : '0%',
                                                transition: 'width 2s cubic-bezier(0.16,1,0.3,1)'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Sidebar.tsx",
                                            lineNumber: 85,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/Sidebar.tsx",
                                        lineNumber: 84,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Sidebar.tsx",
                                lineNumber: 79,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 11,
                                    color: '#646464',
                                    fontFamily: 'JetBrains Mono, monospace',
                                    lineHeight: 1.6
                                },
                                children: [
                                    sac?.wait_minutes ?? 46,
                                    " minutes of this trip is standing still at a stop."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Sidebar.tsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Sidebar.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Sidebar.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "cities",
                style: cardStyle,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: headStyle,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: titleStyle,
                            children: "Transit Score · Other Capitals"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Sidebar.tsx",
                            lineNumber: 96,
                            columnNumber: 32
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/Sidebar.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: bodyStyle,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0
                            },
                            children: [
                                cityRows.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: '88px 1fr 36px',
                                            alignItems: 'center',
                                            gap: 10,
                                            padding: '9px 0',
                                            borderBottom: '1px solid #f0f0f0'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 11,
                                                    color: '#646464',
                                                    fontFamily: 'JetBrains Mono, monospace'
                                                },
                                                children: c.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Sidebar.tsx",
                                                lineNumber: 101,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    height: 3,
                                                    background: '#e5e5e5',
                                                    borderRadius: 9999,
                                                    overflow: 'hidden'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        height: '100%',
                                                        background: c.color,
                                                        borderRadius: 9999,
                                                        width: animated ? `${c.pct}%` : '0%',
                                                        transition: 'width 1.4s cubic-bezier(0.16,1,0.3,1)'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/Sidebar.tsx",
                                                    lineNumber: 103,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Sidebar.tsx",
                                                lineNumber: 102,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 11,
                                                    fontFamily: 'JetBrains Mono, monospace',
                                                    color: '#646464',
                                                    textAlign: 'right'
                                                },
                                                children: c.score.toFixed(1)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Sidebar.tsx",
                                                lineNumber: 105,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, c.name, true, {
                                        fileName: "[project]/app/components/Sidebar.tsx",
                                        lineNumber: 100,
                                        columnNumber: 15
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: '88px 1fr 36px',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '9px 0'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: 11,
                                                color: '#ea2804',
                                                fontFamily: 'JetBrains Mono, monospace',
                                                fontWeight: 700
                                            },
                                            children: "Sacramento ←"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Sidebar.tsx",
                                            lineNumber: 110,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                height: 3,
                                                background: '#e5e5e5',
                                                borderRadius: 9999,
                                                overflow: 'hidden'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    height: '100%',
                                                    background: '#ea2804',
                                                    borderRadius: 9999,
                                                    width: animated ? `${sacPct}%` : '0%',
                                                    transition: 'width 1.4s cubic-bezier(0.16,1,0.3,1) 0.6s'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Sidebar.tsx",
                                                lineNumber: 112,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Sidebar.tsx",
                                            lineNumber: 111,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: 11,
                                                fontFamily: 'JetBrains Mono, monospace',
                                                color: '#ea2804',
                                                fontWeight: 700,
                                                textAlign: 'right'
                                            },
                                            children: sacScore.toFixed(1)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Sidebar.tsx",
                                            lineNumber: 114,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/Sidebar.tsx",
                                    lineNumber: 109,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Sidebar.tsx",
                            lineNumber: 98,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/Sidebar.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Sidebar.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: cardStyle,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: headStyle,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: titleStyle,
                                children: "Next Departures"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Sidebar.tsx",
                                lineNumber: 123,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'inline-flex',
                                    fontSize: 10,
                                    fontWeight: 600,
                                    padding: '3px 12px',
                                    borderRadius: 9999,
                                    background: '#2b9a66',
                                    color: '#fff',
                                    fontFamily: 'JetBrains Mono, monospace'
                                },
                                children: "Nearest stop"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Sidebar.tsx",
                                lineNumber: 124,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Sidebar.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: bodyStyle,
                        children: deps.map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '8px 0',
                                    borderBottom: i < deps.length - 1 ? '1px solid #f0f0f0' : 'none',
                                    gap: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: '#202020',
                                            color: '#fff',
                                            fontSize: 10,
                                            fontWeight: 700,
                                            padding: '2px 10px',
                                            borderRadius: 9999,
                                            fontFamily: 'JetBrains Mono, monospace',
                                            flexShrink: 0
                                        },
                                        children: d.route
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/Sidebar.tsx",
                                        lineNumber: 129,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 11,
                                            color: '#646464',
                                            flex: 1,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        },
                                        children: d.dest
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/Sidebar.tsx",
                                        lineNumber: 130,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: d.min <= 3 ? 'blink' : '',
                                        style: {
                                            fontSize: 11,
                                            fontFamily: 'JetBrains Mono, monospace',
                                            color: d.min <= 10 ? '#ea2804' : '#202020',
                                            fontWeight: d.min <= 10 ? 700 : 400,
                                            whiteSpace: 'nowrap'
                                        },
                                        children: [
                                            d.min,
                                            " min",
                                            d.min <= 3 ? ' !!' : ''
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/Sidebar.tsx",
                                        lineNumber: 131,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, i, true, {
                                fileName: "[project]/app/components/Sidebar.tsx",
                                lineNumber: 128,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/components/Sidebar.tsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Sidebar.tsx",
                lineNumber: 121,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    border: '1px solid #bbbbbb',
                    borderRadius: 20,
                    overflow: 'hidden',
                    opacity: 0.7
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '14px 18px',
                            borderBottom: '1px dashed #bbbbbb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    ...titleStyle,
                                    color: '#bbbbbb'
                                },
                                children: "Light Rail Status"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Sidebar.tsx",
                                lineNumber: 142,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 11,
                                    fontWeight: 600,
                                    padding: '3px 12px',
                                    borderRadius: 9999,
                                    border: '1px solid #bbbbbb',
                                    color: '#bbbbbb',
                                    fontFamily: 'JetBrains Mono, monospace'
                                },
                                children: "no feed"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Sidebar.tsx",
                                lineNumber: 143,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Sidebar.tsx",
                        lineNumber: 141,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: 18,
                            background: '#fafafa'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 12,
                                color: '#646464',
                                fontFamily: 'JetBrains Mono, monospace',
                                lineHeight: 1.7
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    style: {
                                        color: '#202020'
                                    },
                                    children: "42 miles of track. No public real-time data."
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Sidebar.tsx",
                                    lineNumber: 147,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/app/components/Sidebar.tsx",
                                    lineNumber: 147,
                                    columnNumber: 103
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/app/components/Sidebar.tsx",
                                    lineNumber: 147,
                                    columnNumber: 109
                                }, this),
                                "SacRT's light rail system has no live API feed. Train positions are estimated from schedules.",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/app/components/Sidebar.tsx",
                                    lineNumber: 148,
                                    columnNumber: 106
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/app/components/Sidebar.tsx",
                                    lineNumber: 148,
                                    columnNumber: 112
                                }, this),
                                "Parts of Sacramento's transit system are ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    style: {
                                        color: '#202020'
                                    },
                                    children: "invisible — even to itself."
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Sidebar.tsx",
                                    lineNumber: 149,
                                    columnNumber: 54
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Sidebar.tsx",
                            lineNumber: 146,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/Sidebar.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Sidebar.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Sidebar.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
_s(Sidebar, "ukadPZdwlTr0v1rs3p8SEcYLlj4=");
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/TripPlanner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TripPlanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const DEFAULT_STEPS = [
    {
        type: 'walk',
        icon: '🚶',
        label: 'Walk to 35th Ave & 4th stop',
        detail: '0.2 mi',
        dur: 4
    },
    {
        type: 'wait',
        icon: '⏸',
        label: 'Wait for Bus 51',
        detail: 'Next departure: ~28 min',
        dur: 28
    },
    {
        type: 'bus',
        icon: '🚍',
        label: 'Bus 51 → Downtown Transfer',
        detail: '14 stops',
        dur: 32
    },
    {
        type: 'walk',
        icon: '🚶',
        label: 'Walk to destination',
        detail: '0.3 mi',
        dur: 5
    }
];
function TripPlanner({ sac }) {
    _s();
    const [origin, setOrigin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Oak Park, Sacramento');
    const [dest, setDest] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Downtown Sacramento');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [done, setDone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const pain = sac?.pain_factor ?? 6.6;
    async function calculate() {
        if (!origin.trim() || !dest.trim()) {
            setError('Enter both addresses.');
            return;
        }
        setError('');
        setLoading(true);
        await new Promise((r)=>setTimeout(r, 900));
        setLoading(false);
        setDone(true);
    }
    function shareOnX() {
        const text = `My Sacramento commute:\n\n🚍 ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fmtMin"])(sac?.transit_minutes ?? 100)} by transit\n🚗 ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fmtMin"])(sac?.drive_minutes ?? 15)} by car\n\n${pain}× slower — and we're the state capital.\n\nfixsactransit.org`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
    }
    const inputStyle = {
        width: '100%',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 9999,
        color: '#fff',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 13,
        padding: '12px 20px 12px 42px',
        outline: 'none'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "trip-planner",
        style: {
            background: '#202020',
            padding: '80px 32px'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                maxWidth: 1200,
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 48,
                alignItems: 'start'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 11,
                                letterSpacing: '0.2em',
                                color: '#646464',
                                textTransform: 'uppercase',
                                marginBottom: 12,
                                fontFamily: 'JetBrains Mono, monospace'
                            },
                            children: "Calculate your pain ratio"
                        }, void 0, false, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            style: {
                                fontFamily: 'Arial Black, Impact, ui-sans-serif',
                                fontSize: 'clamp(40px, 6vw, 64px)',
                                fontWeight: 900,
                                lineHeight: 0.9,
                                letterSpacing: '-0.02em',
                                color: '#fff',
                                marginBottom: 36,
                                textTransform: 'uppercase'
                            },
                            children: [
                                "YOUR",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 49,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: '#ea2804'
                                    },
                                    children: "COMMUTE"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 49,
                                    columnNumber: 23
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: 8
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: {
                                        fontSize: 9,
                                        letterSpacing: '0.2em',
                                        color: '#646464',
                                        textTransform: 'uppercase',
                                        display: 'block',
                                        marginBottom: 5,
                                        fontFamily: 'JetBrains Mono, monospace'
                                    },
                                    children: "From"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 54,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: 'relative'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                position: 'absolute',
                                                left: 16,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                fontSize: 14,
                                                pointerEvents: 'none'
                                            },
                                            children: "📍"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/TripPlanner.tsx",
                                            lineNumber: 56,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: origin,
                                            onChange: (e)=>setOrigin(e.target.value),
                                            onKeyDown: (e)=>e.key === 'Enter' && calculate(),
                                            placeholder: "Oak Park, Sacramento",
                                            style: inputStyle
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/TripPlanner.tsx",
                                            lineNumber: 57,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 55,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                justifyContent: 'center',
                                margin: '4px 0'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setOrigin(dest);
                                    setDest(origin);
                                },
                                style: {
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    borderRadius: 9999,
                                    width: 30,
                                    height: 30,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#fff',
                                    fontSize: 13
                                },
                                children: "⇅"
                            }, void 0, false, {
                                fileName: "[project]/app/components/TripPlanner.tsx",
                                lineNumber: 63,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: 18
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: {
                                        fontSize: 9,
                                        letterSpacing: '0.2em',
                                        color: '#646464',
                                        textTransform: 'uppercase',
                                        display: 'block',
                                        marginBottom: 5,
                                        fontFamily: 'JetBrains Mono, monospace'
                                    },
                                    children: "To"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 68,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: 'relative'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                position: 'absolute',
                                                left: 16,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                fontSize: 14,
                                                pointerEvents: 'none'
                                            },
                                            children: "🏁"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/TripPlanner.tsx",
                                            lineNumber: 70,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: dest,
                                            onChange: (e)=>setDest(e.target.value),
                                            onKeyDown: (e)=>e.key === 'Enter' && calculate(),
                                            placeholder: "Downtown Sacramento",
                                            style: inputStyle
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/TripPlanner.tsx",
                                            lineNumber: 71,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 69,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 11,
                                color: '#ea2804',
                                marginBottom: 10,
                                fontFamily: 'JetBrains Mono, monospace'
                            },
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 75,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: calculate,
                            disabled: loading,
                            style: {
                                width: '100%',
                                background: loading ? 'rgba(234,40,4,0.5)' : '#ea2804',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 9999,
                                fontFamily: 'JetBrains Mono, monospace',
                                fontSize: 13,
                                fontWeight: 600,
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                padding: '14px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                outline: '3px solid rgba(234,40,4,0.3)',
                                outlineOffset: 2
                            },
                            children: loading ? 'Routing...' : 'Calculate Pain Ratio'
                        }, void 0, false, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 77,
                            columnNumber: 11
                        }, this),
                        !done && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: 16,
                                padding: '14px 18px',
                                border: '1px dashed rgba(255,255,255,0.12)',
                                borderRadius: 16,
                                fontSize: 11,
                                color: '#646464',
                                fontFamily: 'JetBrains Mono, monospace',
                                lineHeight: 1.7
                            },
                            children: "Live address routing in Stage 2. Currently uses Sacramento system data."
                        }, void 0, false, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 82,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/TripPlanner.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        opacity: done ? 1 : 0.25,
                        transition: 'opacity 0.4s',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 24,
                        overflow: 'hidden'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                background: 'rgba(255,255,255,0.05)',
                                padding: '14px 20px',
                                borderBottom: '1px solid rgba(255,255,255,0.08)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: 11,
                                        color: '#646464',
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        fontFamily: 'JetBrains Mono, monospace'
                                    },
                                    children: [
                                        origin.split(',')[0],
                                        " → ",
                                        dest.split(',')[0]
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 92,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        background: '#ea2804',
                                        color: '#fff',
                                        fontSize: 9,
                                        fontWeight: 600,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        padding: '3px 10px',
                                        borderRadius: 9999
                                    },
                                    children: "Live"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 95,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 91,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: '24px 24px 8px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontFamily: 'Arial Black, Impact, ui-sans-serif',
                                        fontSize: 88,
                                        fontWeight: 900,
                                        lineHeight: 0.85,
                                        color: '#ea2804'
                                    },
                                    children: [
                                        pain,
                                        "×"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 100,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 10,
                                        letterSpacing: '0.2em',
                                        color: '#646464',
                                        textTransform: 'uppercase',
                                        marginTop: 10,
                                        fontFamily: 'JetBrains Mono, monospace'
                                    },
                                    children: "Times slower than driving"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 99,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                borderTop: '1px solid rgba(255,255,255,0.08)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: '14px 24px',
                                        borderRight: '1px solid rgba(255,255,255,0.08)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 9,
                                                letterSpacing: '0.15em',
                                                color: '#646464',
                                                textTransform: 'uppercase',
                                                marginBottom: 4,
                                                fontFamily: 'JetBrains Mono, monospace'
                                            },
                                            children: "By Transit"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/TripPlanner.tsx",
                                            lineNumber: 107,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontFamily: 'Arial Black, Impact, ui-sans-serif',
                                                fontWeight: 900,
                                                fontSize: 30,
                                                color: '#ea2804'
                                            },
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fmtMin"])(sac?.transit_minutes ?? 100)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/TripPlanner.tsx",
                                            lineNumber: 108,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 106,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: '14px 24px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 9,
                                                letterSpacing: '0.15em',
                                                color: '#646464',
                                                textTransform: 'uppercase',
                                                marginBottom: 4,
                                                fontFamily: 'JetBrains Mono, monospace'
                                            },
                                            children: "By Car"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/TripPlanner.tsx",
                                            lineNumber: 111,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontFamily: 'Arial Black, Impact, ui-sans-serif',
                                                fontWeight: 900,
                                                fontSize: 30,
                                                color: '#fff'
                                            },
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fmtMin"])(sac?.drive_minutes ?? 15)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/TripPlanner.tsx",
                                            lineNumber: 112,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 110,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 105,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: '14px 24px',
                                borderTop: '1px solid rgba(255,255,255,0.08)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        height: 3,
                                        background: 'rgba(255,255,255,0.08)',
                                        borderRadius: 9999,
                                        marginBottom: 8
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            height: '100%',
                                            background: '#ea2804',
                                            borderRadius: 9999,
                                            width: done ? `${sac?.wait_pct ?? 41}%` : '0%',
                                            transition: 'width 1.5s cubic-bezier(0.16,1,0.3,1)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/TripPlanner.tsx",
                                        lineNumber: 119,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 118,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 11,
                                        color: '#646464',
                                        fontFamily: 'JetBrains Mono, monospace'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: '#ea2804',
                                                fontWeight: 600
                                            },
                                            children: [
                                                sac?.wait_pct ?? 41,
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/TripPlanner.tsx",
                                            lineNumber: 122,
                                            columnNumber: 15
                                        }, this),
                                        " of this trip is waiting — ",
                                        sac?.wait_minutes ?? 41,
                                        " min standing still."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 121,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 117,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                borderTop: '1px solid rgba(255,255,255,0.08)',
                                padding: '14px 24px'
                            },
                            children: DEFAULT_STEPS.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '6px 0',
                                        borderBottom: i < DEFAULT_STEPS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                        fontSize: 11,
                                        color: s.type === 'wait' ? '#ea2804' : '#8d8d8d',
                                        fontFamily: 'JetBrains Mono, monospace'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                width: 18,
                                                textAlign: 'center'
                                            },
                                            children: s.icon
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/TripPlanner.tsx",
                                            lineNumber: 130,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                flex: 1
                                            },
                                            children: [
                                                s.label,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        display: 'block',
                                                        fontSize: 9,
                                                        color: '#4e4e4e',
                                                        marginTop: 1
                                                    },
                                                    children: s.detail
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                                    lineNumber: 131,
                                                    columnNumber: 52
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/TripPlanner.tsx",
                                            lineNumber: 131,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: 10,
                                                color: '#4e4e4e'
                                            },
                                            children: [
                                                s.dur,
                                                "m"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/TripPlanner.tsx",
                                            lineNumber: 132,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 129,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 127,
                            columnNumber: 11
                        }, this),
                        done && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: '14px 24px',
                                borderTop: '1px solid rgba(255,255,255,0.08)',
                                display: 'flex',
                                gap: 10
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: shareOnX,
                                    style: {
                                        flex: 1,
                                        background: '#ea2804',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: 9999,
                                        padding: '11px 16px',
                                        fontSize: 11,
                                        fontWeight: 600,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        fontFamily: 'JetBrains Mono, monospace'
                                    },
                                    children: "Share on X"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 140,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>navigator.clipboard.writeText('https://fixsactransit.org'),
                                    style: {
                                        flex: 1,
                                        background: 'transparent',
                                        color: '#8d8d8d',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        borderRadius: 9999,
                                        padding: '11px 16px',
                                        fontSize: 11,
                                        fontWeight: 600,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        fontFamily: 'JetBrains Mono, monospace'
                                    },
                                    children: "Copy Link"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 141,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 139,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/TripPlanner.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/TripPlanner.tsx",
            lineNumber: 41,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/TripPlanner.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
_s(TripPlanner, "crHokAZ45DEvWuU/0PrZyB3gmt0=");
_c = TripPlanner;
var _c;
__turbopack_context__.k.register(_c, "TripPlanner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/Manifesto.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Manifesto
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function Manifesto() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                style: {
                    background: '#202020',
                    color: '#fff',
                    padding: '96px 32px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            inset: 0,
                            background: 'radial-gradient(ellipse at 50% 50%, rgba(234,40,4,0.15) 0%, transparent 70%)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/components/Manifesto.tsx",
                        lineNumber: 7,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12,
                            fontFamily: 'JetBrains Mono, monospace',
                            color: '#8d8d8d',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            marginBottom: 32,
                            position: 'relative'
                        },
                        children: "Sacramento, California · State Capital"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Manifesto.tsx",
                        lineNumber: 8,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        style: {
                            fontFamily: 'Arial Black, Impact, ui-sans-serif',
                            fontSize: 'clamp(48px, 9vw, 108px)',
                            fontWeight: 900,
                            lineHeight: 0.95,
                            letterSpacing: '-0.02em',
                            textTransform: 'uppercase',
                            marginBottom: 24,
                            position: 'relative'
                        },
                        children: [
                            "This Should",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/app/components/Manifesto.tsx",
                                lineNumber: 12,
                                columnNumber: 22
                            }, this),
                            "Not Be ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: '#ea2804'
                                },
                                children: "Acceptable."
                            }, void 0, false, {
                                fileName: "[project]/app/components/Manifesto.tsx",
                                lineNumber: 12,
                                columnNumber: 35
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Manifesto.tsx",
                        lineNumber: 11,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: 18,
                            color: 'rgba(255,255,255,0.6)',
                            maxWidth: 580,
                            margin: '0 auto 48px',
                            lineHeight: 1.6,
                            position: 'relative'
                        },
                        children: "Thousands of people shuffle into downtown Sacramento every morning, clogging freeways — because transit isn't a real option. We are the capital of a state that leads the world in innovation. We can do better."
                    }, void 0, false, {
                        fileName: "[project]/app/components/Manifesto.tsx",
                        lineNumber: 14,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 12,
                            position: 'relative'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    const text = "Sacramento transit is 6.6× slower than driving. We're the state capital. This should not be acceptable. fixsactransit.org";
                                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
                                },
                                style: {
                                    background: '#202020',
                                    color: '#fcfcfc',
                                    fontSize: 15,
                                    fontWeight: 600,
                                    padding: '12px 28px',
                                    borderRadius: 9999,
                                    border: 'none',
                                    cursor: 'pointer',
                                    outline: '4px solid #202020'
                                },
                                children: "Share This"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Manifesto.tsx",
                                lineNumber: 18,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "https://github.com",
                                target: "_blank",
                                rel: "noopener noreferrer",
                                style: {
                                    background: 'transparent',
                                    color: '#fff',
                                    fontSize: 15,
                                    fontWeight: 600,
                                    padding: '12px 28px',
                                    borderRadius: 9999,
                                    border: '1px solid rgba(255,255,255,0.4)',
                                    cursor: 'pointer',
                                    textDecoration: 'none'
                                },
                                children: "View on GitHub"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Manifesto.tsx",
                                lineNumber: 26,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Manifesto.tsx",
                        lineNumber: 17,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Manifesto.tsx",
                lineNumber: 6,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                style: {
                    background: '#fff',
                    borderTop: '1px solid #e5e5e5',
                    padding: '24px 32px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 12,
                    color: '#8d8d8d',
                    fontFamily: 'JetBrains Mono, monospace',
                    flexWrap: 'wrap',
                    gap: 8
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Data: SacRT GTFS-RT (simulated) · Prototype · Built to make change."
                    }, void 0, false, {
                        fileName: "[project]/app/components/Manifesto.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "fixsactransit.org"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Manifesto.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Manifesto.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_c = Manifesto;
var _c;
__turbopack_context__.k.register(_c, "Manifesto");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_0jtp~8-._.js.map