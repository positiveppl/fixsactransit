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
            padding: 'clamp(12px, 4vw, 16px) clamp(16px, 4vw, 32px)',
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function StatStrip({ sac }) {
    _s();
    const [cols, setCols] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('repeat(4, 1fr)');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StatStrip.useEffect": ()=>{
            const check = {
                "StatStrip.useEffect.check": ()=>setCols(window.innerWidth < 560 ? '1fr 1fr' : 'repeat(4, 1fr)')
            }["StatStrip.useEffect.check"];
            check();
            window.addEventListener('resize', check);
            return ({
                "StatStrip.useEffect": ()=>window.removeEventListener('resize', check)
            })["StatStrip.useEffect"];
        }
    }["StatStrip.useEffect"], []);
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
    const mobile = cols === '1fr 1fr';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'grid',
            gridTemplateColumns: cols,
            borderBottom: '1px solid #e5e5e5'
        },
        children: stats.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: mobile ? '18px 16px' : '28px 32px',
                    borderRight: (mobile ? i % 2 === 0 : i < 3) ? '1px solid #e5e5e5' : 'none',
                    borderBottom: mobile && i < 2 ? '1px solid #e5e5e5' : 'none'
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
                        lineNumber: 32,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontFamily: 'Arial Black, Impact, ui-sans-serif',
                            fontSize: mobile ? 28 : 'clamp(32px, 4vw, 52px)',
                            fontWeight: 900,
                            lineHeight: 1,
                            color: s.color
                        },
                        children: s.value
                    }, void 0, false, {
                        fileName: "[project]/app/components/StatStrip.tsx",
                        lineNumber: 35,
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
                        lineNumber: 38,
                        columnNumber: 11
                    }, this)
                ]
            }, s.label, true, {
                fileName: "[project]/app/components/StatStrip.tsx",
                lineNumber: 27,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/app/components/StatStrip.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_s(StatStrip, "l518E5sOsSbLzh3cLQkKpgazSuQ=");
_c = StatStrip;
var _c;
__turbopack_context__.k.register(_c, "StatStrip");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/TransitMapbox.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TransitMapbox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
// ── Sacramento light rail shapes (from actual GTFS shapes.txt) ─────────────────
// Gold Line: Watt/I-80 ↔ Meadowview (east-west trunk + south branch)
// Blue Line: Sacramento Valley Station ↔ Cosumnes River College (diagonal NW→SE)
// Coordinates are the real alignment, simplified to key waypoints
const BLUE_LINE_COORDS = [
    [
        -121.383135,
        38.645083
    ],
    [
        -121.394656,
        38.642792
    ],
    [
        -121.402497,
        38.638219
    ],
    [
        -121.425051,
        38.621427
    ],
    [
        -121.439696,
        38.607683
    ],
    [
        -121.446798,
        38.606416
    ],
    [
        -121.456956,
        38.606167
    ],
    [
        -121.466190,
        38.602765
    ],
    [
        -121.488042,
        38.585978
    ],
    [
        -121.490258,
        38.580802
    ],
    [
        -121.492022,
        38.578695
    ],
    [
        -121.496721,
        38.579892
    ],
    [
        -121.498746,
        38.578277
    ],
    [
        -121.499864,
        38.575831
    ],
    [
        -121.494532,
        38.574428
    ],
    [
        -121.493370,
        38.571041
    ],
    [
        -121.489352,
        38.569871
    ],
    [
        -121.487925,
        38.559808
    ],
    [
        -121.488174,
        38.551645
    ],
    [
        -121.485398,
        38.542198
    ],
    [
        -121.479995,
        38.525205
    ],
    [
        -121.475956,
        38.512133
    ],
    [
        -121.471624,
        38.497634
    ],
    [
        -121.467137,
        38.483255
    ],
    [
        -121.463084,
        38.465695
    ],
    [
        -121.447837,
        38.462660
    ],
    [
        -121.428947,
        38.458469
    ],
    [
        -121.418192,
        38.452777
    ]
];
const GOLD_LINE_COORDS = [
    [
        -121.499690,
        38.584844
    ],
    [
        -121.496934,
        38.582566
    ],
    [
        -121.497882,
        38.580205
    ],
    [
        -121.496721,
        38.579892
    ],
    [
        -121.498746,
        38.578277
    ],
    [
        -121.499864,
        38.575831
    ],
    [
        -121.494532,
        38.574428
    ],
    [
        -121.493370,
        38.571041
    ],
    [
        -121.489352,
        38.569871
    ],
    [
        -121.479092,
        38.566641
    ],
    [
        -121.471335,
        38.564560
    ],
    [
        -121.457756,
        38.560658
    ],
    [
        -121.448619,
        38.558239
    ],
    [
        -121.435863,
        38.554803
    ],
    [
        -121.427306,
        38.552612
    ],
    [
        -121.407499,
        38.547350
    ],
    [
        -121.393058,
        38.547044
    ],
    [
        -121.373319,
        38.553826
    ],
    [
        -121.362311,
        38.559352
    ],
    [
        -121.353046,
        38.564059
    ],
    [
        -121.346181,
        38.567306
    ],
    [
        -121.311137,
        38.584794
    ],
    [
        -121.290457,
        38.594810
    ],
    [
        -121.283142,
        38.598441
    ],
    [
        -121.267599,
        38.605999
    ],
    [
        -121.212479,
        38.630198
    ],
    [
        -121.190422,
        38.644296
    ],
    [
        -121.183663,
        38.663372
    ],
    [
        -121.180485,
        38.676482
    ]
];
const GREEN_LINE_COORDS = [
    [
        -121.492355,
        38.596501
    ],
    [
        -121.496934,
        38.582566
    ],
    [
        -121.497882,
        38.580205
    ],
    [
        -121.496721,
        38.579892
    ],
    [
        -121.498746,
        38.578277
    ],
    [
        -121.499864,
        38.575831
    ],
    [
        -121.494532,
        38.574428
    ],
    [
        -121.493370,
        38.571041
    ]
];
// Headway for simulated trains (minutes between trains per direction)
const TRAIN_HEADWAY_MIN = 15;
const N_TRAINS_PER_LINE = 4;
function lerp(a, b, t) {
    return a + (b - a) * t;
}
function coordAtT(coords, t) {
    if (t <= 0) return coords[0];
    if (t >= 1) return coords[coords.length - 1];
    const idx = t * (coords.length - 1);
    const lo = Math.floor(idx);
    const hi = Math.min(lo + 1, coords.length - 1);
    const f = idx - lo;
    return [
        lerp(coords[lo][0], coords[hi][0], f),
        lerp(coords[lo][1], coords[hi][1], f)
    ];
}
function bearingAtT(coords, t) {
    const eps = 0.01;
    const a = coordAtT(coords, Math.max(0, t - eps));
    const b = coordAtT(coords, Math.min(1, t + eps));
    const dx = b[0] - a[0], dy = b[1] - a[1];
    return Math.atan2(dx, dy) * 180 / Math.PI;
}
function TransitMapbox({ mapboxToken }) {
    _s();
    const mapContainer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const markersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const trainMarkersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const animFrameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const trainStateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const busDataRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const countRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [mapLoaded, setMapLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [busCount, setBusCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [lastFetch, setLastFetch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [fetchError, setFetchError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Init simulated trains — stagger their starting positions evenly
    function initTrains() {
        const trains = [];
        const lines = [
            {
                key: 'gold',
                color: '#F9A61A'
            },
            {
                key: 'blue',
                color: '#2563EB'
            }
        ];
        lines.forEach(({ key, color })=>{
            for(let i = 0; i < N_TRAINS_PER_LINE; i++){
                trains.push({
                    id: `${key}-${i}`,
                    line: key,
                    t: i / N_TRAINS_PER_LINE,
                    dir: i % 2 === 0 ? 1 : -1,
                    color
                });
            }
        });
        return trains;
    }
    // Fetch real bus positions from our API route
    const fetchBuses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TransitMapbox.useCallback[fetchBuses]": async ()=>{
            try {
                const res = await fetch('/api/vehicles', {
                    cache: 'no-store'
                });
                if (!res.ok) throw new Error(`${res.status}`);
                const data = await res.json();
                const vehicles = (data.vehicles || []).filter({
                    "TransitMapbox.useCallback[fetchBuses].vehicles": (v)=>v.latitude && v.longitude && Math.abs(v.latitude) > 1
                }["TransitMapbox.useCallback[fetchBuses].vehicles"]);
                busDataRef.current = vehicles;
                setBusCount(vehicles.length);
                setLastFetch(new Date().toLocaleTimeString());
                setFetchError(false);
                return vehicles;
            } catch  {
                setFetchError(true);
                return [];
            }
        }
    }["TransitMapbox.useCallback[fetchBuses]"], []);
    // Create or update bus marker DOM element
    function makeBusEl(vehicle) {
        const el = document.createElement('div');
        el.className = 'transit-bus-marker';
        el.style.cssText = `
      width: 22px; height: 22px;
      background: #ea2804;
      border: 2px solid #fff;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 8px rgba(234,40,4,0.5);
      cursor: pointer;
      transition: transform 0.3s ease;
      position: relative;
    `;
        // Route badge
        const badge = document.createElement('span');
        badge.style.cssText = `
      font-family: 'JetBrains Mono', monospace;
      font-size: 7px; font-weight: 700;
      color: #fff; line-height: 1;
      text-align: center; overflow: hidden;
      max-width: 18px; white-space: nowrap;
    `;
        badge.textContent = vehicle.route_id?.slice(0, 3) || '·';
        el.appendChild(badge);
        // Bearing indicator
        if (vehicle.bearing) {
            const arrow = document.createElement('div');
            arrow.style.cssText = `
        position: absolute; top: -8px; left: 50%;
        transform: translateX(-50%) rotate(${vehicle.bearing}deg);
        width: 0; height: 0;
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
        border-bottom: 7px solid #ea2804;
      `;
            el.appendChild(arrow);
        }
        return el;
    }
    function makeTrainEl(color) {
        const el = document.createElement('div');
        el.style.cssText = `
      width: 12px; height: 12px;
      background: transparent;
      border: 2px solid ${color};
      border-radius: 50%;
      box-shadow: 0 0 6px ${color}66;
      pointer-events: none;
    `;
        return el;
    }
    // Update bus markers on the map
    function updateBusMarkers(map, vehicles) {
        const seen = new Set();
        vehicles.forEach((v)=>{
            seen.add(v.id);
            const existing = markersRef.current.get(v.id);
            if (existing) {
                // Animate to new position
                existing.setLngLat([
                    v.longitude,
                    v.latitude
                ]);
            } else {
                const el = makeBusEl(v);
                const popup = new mapboxgl.Popup({
                    offset: 14,
                    closeButton: false,
                    className: 'transit-popup'
                }).setHTML(`
            <div style="font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.5;padding:4px 8px">
              <strong style="color:#ea2804">Route ${v.route_id || '—'}</strong><br/>
              Vehicle ${v.vehicle_label || v.id}<br/>
              ${v.speed ? `${Math.round(v.speed * 3.6)}km/h` : 'Stationary'}
            </div>
          `);
                const marker = new mapboxgl.Marker({
                    element: el,
                    rotation: 0
                }).setLngLat([
                    v.longitude,
                    v.latitude
                ]).setPopup(popup).addTo(map);
                markersRef.current.set(v.id, marker);
            }
        });
        // Remove stale markers
        markersRef.current.forEach((marker, id)=>{
            if (!seen.has(id)) {
                marker.remove();
                markersRef.current.delete(id);
            }
        });
    }
    // Animate simulated trains
    function animateTrains(map) {
        const SPEED = 0.00012 // fraction of line per frame @ 60fps
        ;
        function frame() {
            trainStateRef.current.forEach((train, i)=>{
                train.t += SPEED * train.dir;
                if (train.t >= 1) {
                    train.t = 1;
                    train.dir = -1;
                }
                if (train.t <= 0) {
                    train.t = 0;
                    train.dir = 1;
                }
                const coords = train.line === 'gold' ? GOLD_LINE_COORDS : BLUE_LINE_COORDS;
                const [lng, lat] = coordAtT(coords, train.t);
                const bearing = bearingAtT(coords, train.t);
                if (trainMarkersRef.current[i]) {
                    trainMarkersRef.current[i].setLngLat([
                        lng,
                        lat
                    ]);
                    const el = trainMarkersRef.current[i].getElement();
                    el.style.transform = `rotate(${bearing}deg)`;
                }
            });
            // Pulse glow on Gold/Blue line layers
            const t = Date.now() / 1000;
            const goldOpacity = 0.4 + Math.sin(t * 1.2) * 0.15;
            const blueOpacity = 0.4 + Math.sin(t * 1.5 + 1) * 0.15;
            if (map.getLayer('gold-line')) map.setPaintProperty('gold-line', 'line-opacity', goldOpacity);
            if (map.getLayer('blue-line')) map.setPaintProperty('blue-line', 'line-opacity', blueOpacity);
            animFrameRef.current = requestAnimationFrame(frame);
        }
        frame();
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TransitMapbox.useEffect": ()=>{
            if (!mapContainer.current || !mapboxToken || mapRef.current) return;
            // Dynamically load Mapbox GL JS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css';
            document.head.appendChild(link);
            const script = document.createElement('script');
            script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js';
            script.onload = ({
                "TransitMapbox.useEffect": ()=>{
                    const mapboxgl1 = window.mapboxgl;
                    mapboxgl1.accessToken = mapboxToken;
                    const map = new mapboxgl1.Map({
                        container: mapContainer.current,
                        style: 'mapbox://styles/mapbox/light-v11',
                        center: [
                            -121.4944,
                            38.5816
                        ],
                        zoom: 12.5,
                        pitch: 0,
                        bearing: 0,
                        attributionControl: false
                    });
                    mapRef.current = map;
                    map.addControl(new mapboxgl1.NavigationControl({
                        showCompass: false
                    }), 'bottom-right');
                    map.on('load', {
                        "TransitMapbox.useEffect": ()=>{
                            // ── Add rail line sources ──────────────────────────────────────
                            map.addSource('gold-line-source', {
                                type: 'geojson',
                                data: {
                                    type: 'Feature',
                                    geometry: {
                                        type: 'LineString',
                                        coordinates: GOLD_LINE_COORDS
                                    },
                                    properties: {}
                                }
                            });
                            map.addSource('blue-line-source', {
                                type: 'geojson',
                                data: {
                                    type: 'Feature',
                                    geometry: {
                                        type: 'LineString',
                                        coordinates: BLUE_LINE_COORDS
                                    },
                                    properties: {}
                                }
                            });
                            map.addSource('green-line-source', {
                                type: 'geojson',
                                data: {
                                    type: 'Feature',
                                    geometry: {
                                        type: 'LineString',
                                        coordinates: GREEN_LINE_COORDS
                                    },
                                    properties: {}
                                }
                            });
                            // Gold Line track (dashed — no real-time feed)
                            map.addLayer({
                                id: 'gold-line-bg',
                                type: 'line',
                                source: 'gold-line-source',
                                paint: {
                                    'line-color': '#F9A61A',
                                    'line-width': 2,
                                    'line-opacity': 0.15
                                }
                            });
                            map.addLayer({
                                id: 'gold-line',
                                type: 'line',
                                source: 'gold-line-source',
                                paint: {
                                    'line-color': '#F9A61A',
                                    'line-width': 2,
                                    'line-dasharray': [
                                        4,
                                        4
                                    ],
                                    'line-opacity': 0.4
                                }
                            });
                            // Blue Line track (dashed — no real-time feed)
                            map.addLayer({
                                id: 'blue-line-bg',
                                type: 'line',
                                source: 'blue-line-source',
                                paint: {
                                    'line-color': '#2563EB',
                                    'line-width': 2,
                                    'line-opacity': 0.15
                                }
                            });
                            map.addLayer({
                                id: 'blue-line',
                                type: 'line',
                                source: 'blue-line-source',
                                paint: {
                                    'line-color': '#2563EB',
                                    'line-width': 2,
                                    'line-dasharray': [
                                        4,
                                        4
                                    ],
                                    'line-opacity': 0.4
                                }
                            });
                            // Green Line — suspended, so solid dim style (no animated dash)
                            map.addLayer({
                                id: 'green-line',
                                type: 'line',
                                source: 'green-line-source',
                                paint: {
                                    'line-color': '#16a34a',
                                    'line-width': 2,
                                    'line-opacity': 0.25,
                                    'line-dasharray': [
                                        2,
                                        6
                                    ]
                                }
                            });
                            // ── Init simulated trains ──────────────────────────────────────
                            trainStateRef.current = initTrains();
                            trainStateRef.current.forEach({
                                "TransitMapbox.useEffect": (train)=>{
                                    const coords = train.line === 'gold' ? GOLD_LINE_COORDS : train.line === 'blue' ? BLUE_LINE_COORDS : GREEN_LINE_COORDS;
                                    const [lng, lat] = coordAtT(coords, train.t);
                                    const lineName = train.line === 'gold' ? 'Gold Line' : train.line === 'blue' ? 'Blue Line' : 'Green Line';
                                    const popup = new mapboxgl1.Popup({
                                        offset: 10,
                                        closeButton: false
                                    }).setHTML(`
              <div style="font-family:'JetBrains Mono',monospace;font-size:11px;padding:4px 8px;line-height:1.5">
                <strong style="color:${train.color}">${lineName}</strong><br/>
                <span style="color:#8d8d8d">Simulated — no real-time feed</span>
              </div>
            `);
                                    const marker = new mapboxgl1.Marker({
                                        element: makeTrainEl(train.color)
                                    }).setLngLat([
                                        lng,
                                        lat
                                    ]).setPopup(popup).addTo(map);
                                    trainMarkersRef.current.push(marker);
                                }
                            }["TransitMapbox.useEffect"]);
                            // ── Start animation ────────────────────────────────────────────
                            animateTrains(map);
                            // ── Initial bus fetch ──────────────────────────────────────────
                            fetchBuses().then({
                                "TransitMapbox.useEffect": (vehicles)=>{
                                    if (vehicles.length > 0) updateBusMarkers(map, vehicles);
                                }
                            }["TransitMapbox.useEffect"]);
                            setMapLoaded(true);
                        }
                    }["TransitMapbox.useEffect"]);
                }
            })["TransitMapbox.useEffect"];
            document.head.appendChild(script);
            return ({
                "TransitMapbox.useEffect": ()=>{
                    cancelAnimationFrame(animFrameRef.current);
                    mapRef.current?.remove();
                    mapRef.current = null;
                    trainMarkersRef.current = [];
                    markersRef.current.clear();
                }
            })["TransitMapbox.useEffect"];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["TransitMapbox.useEffect"], [
        mapboxToken
    ]);
    // Poll bus positions every 15 seconds
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TransitMapbox.useEffect": ()=>{
            if (!mapLoaded) return;
            const interval = setInterval({
                "TransitMapbox.useEffect.interval": async ()=>{
                    const vehicles = await fetchBuses();
                    if (mapRef.current && vehicles.length > 0) {
                        updateBusMarkers(mapRef.current, vehicles);
                    }
                }
            }["TransitMapbox.useEffect.interval"], 15000);
            return ({
                "TransitMapbox.useEffect": ()=>clearInterval(interval)
            })["TransitMapbox.useEffect"];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["TransitMapbox.useEffect"], [
        mapLoaded,
        fetchBuses
    ]);
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
                        children: "sacrt_live_map.js"
                    }, void 0, false, {
                        fileName: "[project]/app/components/TransitMapbox.tsx",
                        lineNumber: 494,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: 8
                        },
                        children: [
                            !fetchError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        fileName: "[project]/app/components/TransitMapbox.tsx",
                                        lineNumber: 508,
                                        columnNumber: 15
                                    }, this),
                                    busCount > 0 ? `${busCount} buses live` : 'Connecting...'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/TransitMapbox.tsx",
                                lineNumber: 502,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 5,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    padding: '3px 12px',
                                    borderRadius: 9999,
                                    border: '1px solid #ea2804',
                                    color: '#ea2804',
                                    fontFamily: 'JetBrains Mono, monospace'
                                },
                                children: "Feed error — retrying"
                            }, void 0, false, {
                                fileName: "[project]/app/components/TransitMapbox.tsx",
                                lineNumber: 512,
                                columnNumber: 13
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
                                fileName: "[project]/app/components/TransitMapbox.tsx",
                                lineNumber: 521,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/TransitMapbox.tsx",
                        lineNumber: 500,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/TransitMapbox.tsx",
                lineNumber: 490,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'relative'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: mapContainer,
                        style: {
                            width: '100%',
                            height: 420
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/components/TransitMapbox.tsx",
                        lineNumber: 534,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            pointerEvents: 'none',
                            textAlign: 'center',
                            zIndex: 2,
                            opacity: mapLoaded ? 1 : 0,
                            transition: 'opacity 0.5s'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                background: 'rgba(255,255,255,0.82)',
                                backdropFilter: 'blur(4px)',
                                border: '1px solid rgba(0,0,0,0.08)',
                                borderRadius: 8,
                                padding: '5px 12px'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontFamily: 'JetBrains Mono, monospace',
                                    fontSize: 9,
                                    letterSpacing: '0.15em',
                                    color: 'rgba(0,0,0,0.2)',
                                    textTransform: 'uppercase'
                                },
                                children: "Rail position unknown · No public real-time feed"
                            }, void 0, false, {
                                fileName: "[project]/app/components/TransitMapbox.tsx",
                                lineNumber: 549,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/TransitMapbox.tsx",
                            lineNumber: 543,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/TransitMapbox.tsx",
                        lineNumber: 537,
                        columnNumber: 9
                    }, this),
                    !mapLoaded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            inset: 0,
                            background: '#fafafa',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontFamily: 'JetBrains Mono, monospace',
                                fontSize: 11,
                                color: '#8d8d8d',
                                letterSpacing: '0.08em'
                            },
                            children: "Loading map..."
                        }, void 0, false, {
                            fileName: "[project]/app/components/TransitMapbox.tsx",
                            lineNumber: 566,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/TransitMapbox.tsx",
                        lineNumber: 561,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/TransitMapbox.tsx",
                lineNumber: 533,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: 20,
                    padding: '10px 20px 10px',
                    flexWrap: 'wrap'
                },
                children: [
                    {
                        color: '#ea2804',
                        label: 'Bus (GPS — live)',
                        dot: true,
                        border: '2px solid #fff'
                    },
                    {
                        color: '#F9A61A',
                        label: 'Gold Line (schedule est.)',
                        dot: false
                    },
                    {
                        color: '#2563EB',
                        label: 'Blue Line (schedule est.)',
                        dot: false
                    },
                    {
                        color: '#16a34a',
                        label: 'Green Line (suspended Jun 2025)',
                        dot: false,
                        dashed: true,
                        dim: true
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
                            l.dot ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    background: l.color,
                                    border: l.border || 'none',
                                    flexShrink: 0,
                                    boxShadow: `0 0 4px ${l.color}66`
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/components/TransitMapbox.tsx",
                                lineNumber: 589,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 20,
                                    height: 0,
                                    borderTop: `2px dashed ${l.color}`,
                                    flexShrink: 0,
                                    opacity: 0.7
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/components/TransitMapbox.tsx",
                                lineNumber: 593,
                                columnNumber: 17
                            }, this),
                            l.label
                        ]
                    }, i, true, {
                        fileName: "[project]/app/components/TransitMapbox.tsx",
                        lineNumber: 584,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/components/TransitMapbox.tsx",
                lineNumber: 577,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '12px 20px',
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
                        children: busCount > 0 ? `${busCount} buses tracked · ${trainStateRef.current.length} rail (simulated)` : 'Connecting to SacRT feed...'
                    }, void 0, false, {
                        fileName: "[project]/app/components/TransitMapbox.tsx",
                        lineNumber: 609,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 11,
                            color: '#8d8d8d'
                        },
                        children: lastFetch ? `Updated ${lastFetch}` : 'Updates every 15s'
                    }, void 0, false, {
                        fileName: "[project]/app/components/TransitMapbox.tsx",
                        lineNumber: 614,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/TransitMapbox.tsx",
                lineNumber: 605,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        .transit-popup .mapboxgl-popup-content {
          padding: 0 !important;
          border-radius: 10px !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
          border: 1px solid #e5e5e5 !important;
          overflow: hidden;
        }
        .transit-popup .mapboxgl-popup-tip { display: none; }
        .mapboxgl-ctrl-bottom-right { bottom: 8px !important; right: 8px !important; }
        .mapboxgl-ctrl-group { border-radius: 8px !important; border: 1px solid #e5e5e5 !important; box-shadow: none !important; }
      `
            }, void 0, false, {
                fileName: "[project]/app/components/TransitMapbox.tsx",
                lineNumber: 619,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/TransitMapbox.tsx",
        lineNumber: 488,
        columnNumber: 5
    }, this);
}
_s(TransitMapbox, "TQJCTdIzk37Ujz6Kij3WfK+FeHo=");
_c = TransitMapbox;
var _c;
__turbopack_context__.k.register(_c, "TransitMapbox");
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
    const [cols, setCols] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('1fr 1fr');
    const mobile = cols === '1fr';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TripPlanner.useEffect": ()=>{
            const check = {
                "TripPlanner.useEffect.check": ()=>setCols(window.innerWidth < 900 ? '1fr' : '1fr 1fr')
            }["TripPlanner.useEffect.check"];
            check();
            window.addEventListener('resize', check);
            return ({
                "TripPlanner.useEffect": ()=>window.removeEventListener('resize', check)
            })["TripPlanner.useEffect"];
        }
    }["TripPlanner.useEffect"], []);
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
            padding: mobile ? '60px 20px' : '80px 32px'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                maxWidth: 1200,
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
                gap: mobile ? 32 : 48,
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
                            lineNumber: 60,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            style: {
                                fontFamily: 'Arial Black, Impact, ui-sans-serif',
                                fontSize: mobile ? 40 : 'clamp(40px, 6vw, 64px)',
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
                                    lineNumber: 64,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: '#ea2804'
                                    },
                                    children: "COMMUTE"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 64,
                                    columnNumber: 23
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 63,
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
                                            children: "📍"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/TripPlanner.tsx",
                                            lineNumber: 70,
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
                                lineNumber: 76,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 75,
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
                                    lineNumber: 80,
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
                                            lineNumber: 82,
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
                                            lineNumber: 83,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 81,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 79,
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
                            lineNumber: 87,
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
                                cursor: loading ? 'not-allowed' : 'pointer'
                            },
                            children: loading ? 'Routing...' : 'Calculate Pain Ratio'
                        }, void 0, false, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 89,
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
                            lineNumber: 94,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/TripPlanner.tsx",
                    lineNumber: 59,
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
                                    lineNumber: 103,
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
                                    lineNumber: 106,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 102,
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
                                    lineNumber: 110,
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
                                    lineNumber: 111,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 109,
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
                                            lineNumber: 116,
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
                                            lineNumber: 117,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 115,
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
                                            lineNumber: 120,
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
                                            lineNumber: 121,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 119,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 114,
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
                                        lineNumber: 127,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 126,
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
                                            lineNumber: 130,
                                            columnNumber: 15
                                        }, this),
                                        " of this trip is waiting — ",
                                        sac?.wait_minutes ?? 41,
                                        " min standing still."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 129,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 125,
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
                                            lineNumber: 137,
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
                                                    lineNumber: 138,
                                                    columnNumber: 52
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/TripPlanner.tsx",
                                            lineNumber: 138,
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
                                            lineNumber: 139,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/app/components/TripPlanner.tsx",
                                    lineNumber: 136,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 134,
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
                                    lineNumber: 146,
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
                                    lineNumber: 147,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/TripPlanner.tsx",
                            lineNumber: 145,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/TripPlanner.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/TripPlanner.tsx",
            lineNumber: 50,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/TripPlanner.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(TripPlanner, "otyuiLhV8KgjM8R8/6+JpKVim4w=");
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
"[project]/app/components/ResponsiveGrid.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ContentGrid",
    ()=>ContentGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function ContentGrid({ children }) {
    _s();
    const [cols, setCols] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('1fr 380px');
    const [pad, setPad] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('64px 32px');
    const [gap, setGap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(48);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ContentGrid.useEffect": ()=>{
            const check = {
                "ContentGrid.useEffect.check": ()=>{
                    const mobile = window.innerWidth < 900;
                    setCols(mobile ? '1fr' : '1fr 380px');
                    setPad(mobile ? '32px 16px' : '64px 32px');
                    setGap(mobile ? 24 : 48);
                }
            }["ContentGrid.useEffect.check"];
            check();
            window.addEventListener('resize', check);
            return ({
                "ContentGrid.useEffect": ()=>window.removeEventListener('resize', check)
            })["ContentGrid.useEffect"];
        }
    }["ContentGrid.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            maxWidth: 1200,
            margin: '0 auto',
            padding: pad,
            display: 'grid',
            gridTemplateColumns: cols,
            gap
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/app/components/ResponsiveGrid.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_s(ContentGrid, "hiACnI8JhucTooFeGTVl8LkHb6c=");
_c = ContentGrid;
var _c;
__turbopack_context__.k.register(_c, "ContentGrid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_0gqp3pl._.js.map