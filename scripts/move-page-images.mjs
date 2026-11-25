// public/images/figma-pages 안의 이미지를 페이지 · 섹션별 폴더로 옮깁니다.
// 프로젝트 맨 위 폴더에서 한 번만 실행: node scripts/move-page-images.mjs
// (먼저 실행해서 미리 보기만: node scripts/move-page-images.mjs --dry)
import { existsSync, mkdirSync, readdirSync, renameSync, rmdirSync } from "node:fs";
import { join } from "node:path";

const from = join("public", "images", "figma-pages");
const dry = process.argv.includes("--dry");

// [파일 이름 앞부분, 옮길 폴더, 앞부분 떼기]
const rules = [
    ["buying-guide-", "buying-guide", true],
    ["order-complete-", "checkout", false],
    ["payment-", "checkout", false],
    ["about-", "about", true],
    ["esports-", "esports", true],
    ["gallery-", "esports", false],
    ["technology-", "technology", true],
    ["membership-", "membership", true],
    ["exclusive-", "exclusive", true],
    ["warranty-", "warranty", true],
    ["faq-", "faq", true],
    ["support-", "support", true],
    ["reset-", "password-reset", true],
    ["rail-", "common", false],
    ["explore", "common", false],
];

if (!existsSync(from)) {
    console.log("옮길 폴더가 없어요:", from);
    process.exit(0);
}

const left = [];
for (const name of readdirSync(from)) {
    // 팀 로고 SVG는 WebP로 바뀌어 더 이상 쓰지 않음
    if (/^esports-team-logo-\d+\.svg$/.test(name)) {
        left.push(name + "  (안 씀 · 지워도 됨)");
        continue;
    }
    const rule = rules.find(([prefix]) => name.startsWith(prefix));
    if (!rule) {
        left.push(name);
        continue;
    }
    const [prefix, folder, strip] = rule;
    const target = join("public", "images", folder, strip ? name.slice(prefix.length) : name);
    if (existsSync(target)) {
        left.push(name + "  (이미 있음: " + target + ")");
        continue;
    }
    console.log(name, "→", target);
    if (!dry) {
        mkdirSync(join("public", "images", folder), { recursive: true });
        renameSync(join(from, name), target);
    }
}

if (left.length) {
    console.log("\n그대로 둔 파일:");
    left.forEach((name) => console.log(" -", name));
} else if (!dry) {
    rmdirSync(from);
    console.log("\nfigma-pages 폴더를 비우고 지웠어요.");
}
