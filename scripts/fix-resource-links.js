/**
 * resource_link를 신뢰할 수 있는 출처(.gov, .edu, Britannica)로 교체
 * 실행: node scripts/fix-resource-links.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JSON_PATH = path.join(__dirname, '../public/questions.json');

// NASA 행성/우주 페이지 (science.nasa.gov)
const NASA = {
  moon: 'https://science.nasa.gov/moon/',
  mars: 'https://science.nasa.gov/mars/',
  mercury: 'https://science.nasa.gov/mercury/',
  venus: 'https://science.nasa.gov/venus/',
  jupiter: 'https://science.nasa.gov/jupiter/',
  saturn: 'https://science.nasa.gov/saturn/',
  uranus: 'https://science.nasa.gov/uranus/',
  neptune: 'https://science.nasa.gov/neptune/',
  solar: 'https://science.nasa.gov/solar-system/',
  apollo: 'https://www.nasa.gov/mission_pages/apollo/index.html',
  planets: 'https://science.nasa.gov/solar-system/planets/',
};

// 도메인별 기본 교체 (404/불안정/페이월드)
const DOMAIN_REPLACE = {
  'gizmodo.com': 'https://www.britannica.com/technology/human-computer-interaction',
  'theatlantic.com': 'https://www.britannica.com/science/second-law-of-thermodynamics',
  'youarenotsosmart.com': 'https://www.britannica.com/science/placebo-effect',
  'cnbc.com': 'https://www.britannica.com/technology/quantum-computer',
  'businessinsider.com': 'https://thebulletin.org/doomsday-clock/',
  'slate.com': 'https://www.britannica.com/',
  'polygon.com': 'https://www.britannica.com/art/video-game',
  'arstechnica.com': 'https://www.britannica.com/technology/artificial-intelligence',
  'theguardian.com': 'https://www.britannica.com/technology/robotics',
  'wired.com': 'https://www.britannica.com/technology/computer-security',
  'techeblog.com': 'https://www.britannica.com/technology/prototype',
  'uxdesign.cc': 'https://www.britannica.com/technology/human-computer-interaction',
  'psychologytoday.com': 'https://www.britannica.com/science/psychology',
  'popsci.com': 'https://www.britannica.com/science/animal-behavior',
  'theconversation.com': 'https://www.britannica.com/science/adolescence',
  'theecologist.org': 'https://www.britannica.com/science/climate-change',
  'saturdayeveningpost.com': 'https://www.britannica.com/science/adolescence',
  'serres-lab.com': 'https://www.britannica.com/science/animal-behavior',
  'hokulea.com': 'https://www.britannica.com/topic/Polynesian-culture',
  'nsf.gov': 'https://science.nasa.gov/earth/earth-science/', // .gov 유지하되 경로 수정
  'teslasciencecenter.org': 'https://www.britannica.com/biography/Nikola-Tesla',
  'caryinstitute.org': 'https://www.britannica.com/science/ecology',
  'thisisservicedesigndoing.com': 'https://www.britannica.com/technology/prototype',
  'ibm.com': 'https://www.britannica.com/technology/computer-programming',
  'sciencefocus.com': 'https://www.britannica.com/technology/artificial-intelligence',
  'ruthtrumpold.id.au': 'https://www.britannica.com/technology/prototype',
  'simplypsychology.org': 'https://www.britannica.com/science/psychology',
  'psychologicalscience.org': 'https://www.britannica.com/science/psychology',
};

// 교체 유지: .gov, .edu, Britannica, NASA, Bulletin, WSC themes
const KEEP_DOMAINS = [
  'britannica.com', 'nasa.gov', 'science.nasa.gov', 'thebulletin.org',
  'themes.scholarscup.org', 'hdr.undp.org', 'pmi.org', 'moma.org',
  'bbc.com', 'tolkiensociety.org',
];

// BBC 404로 알려진 URL
const BBC_REPLACE = {
  'https://www.bbc.com/future/article/20120221-food-pills-staple-of-sci-fi': 'https://www.britannica.com/technology/food',
  'https://www.bbc.com/future/article/20120221-food-pills-a-staple-of-sci-fi': 'https://www.britannica.com/technology/food',
};

// simplypsychology.org 루트만 있는 경우
const SIMPLY_PSYCHOLOGY_ROOT = 'https://www.simplypsychology.org/';

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function shouldReplace(url) {
  const domain = getDomain(url);
  if (KEEP_DOMAINS.some((d) => domain.includes(d))) return false;
  if (domain.endsWith('.gov') || domain.endsWith('.edu')) return false;
  return true;
}

function findReplacement(question, url) {
  const domain = getDomain(url);
  if (KEEP_DOMAINS.some((d) => domain.includes(d))) return null;
  if (domain.endsWith('.gov') || domain.endsWith('.edu')) return null;

  const q = (question.question + ' ' + (question.explanation || '')).toLowerCase();

  // 1. BBC 404 알려진 URL
  if (BBC_REPLACE[url]) return BBC_REPLACE[url];

  // 2. simplypsychology 루트 (경로 없음)
  if (url === SIMPLY_PSYCHOLOGY_ROOT || url === 'https://www.simplypsychology.org') {
    if (q.includes('zeigarnik')) return 'https://www.britannica.com/science/psychology';
    if (q.includes('motivation') || q.includes('goal')) return 'https://www.britannica.com/science/motivation';
    if (q.includes('mindset')) return 'https://www.britannica.com/science/cognitive-bias';
    return 'https://www.britannica.com/science/psychology';
  }

  // 3. 행성/우주 관련 → NASA
  if (q.includes('moon') || q.includes('apollo')) return NASA.apollo;
  if (q.includes('mars')) return NASA.mars;
  if (q.includes('mercury')) return NASA.mercury;
  if (q.includes('venus')) return NASA.venus;
  if (q.includes('jupiter')) return NASA.jupiter;
  if (q.includes('saturn')) return NASA.saturn;
  if (q.includes('uranus')) return NASA.uranus;
  if (q.includes('neptune')) return NASA.neptune;
  if (q.includes('solar system') || q.includes('planet')) return NASA.planets;
  if (q.includes('milky way') || q.includes('galaxy')) return 'https://science.nasa.gov/universe/galaxies/';
  if (q.includes('space') || q.includes('astronaut') || q.includes('orbit')) return NASA.solar;

  // 4. 도메인별 교체
  for (const [d, replacement] of Object.entries(DOMAIN_REPLACE)) {
    if (domain.includes(d)) return replacement;
  }

  return null;
}

function main() {
  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  let count = 0;

  for (const q of data) {
    const link = q.resource_link;
    if (!link) continue;

    const replacement = findReplacement(q, link);
    if (replacement) {
      q.resource_link = replacement;
      count++;
    }
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Replaced ${count} resource_link entries.`);
}

main();
