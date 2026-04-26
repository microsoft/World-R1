const assetBase = document.body?.dataset.assetBase || "";
const isZh = (document.body?.dataset.lang || "").toLowerCase().startsWith("zh");

const taxonomyI18n = {
  "Natural Landscapes": {
    title: "自然景观",
    description: "强调大尺度几何、流体结构与天气氛围的一致性。",
    groups: {
      Landforms: { title: "地貌", chip: "地貌" },
      "Water Features": { title: "水体景观", chip: "水体" },
      "Weather & Time": { title: "天气与时间", chip: "天气" }
    }
  },
  "Urban and Architectural": {
    title: "城市与建筑",
    description: "强调透视准确性、结构稳定性与直线几何保持。",
    groups: {
      "Urban Landscapes": { title: "城市场景", chip: "城市" },
      "Indoor Spaces": { title: "室内空间", chip: "室内" },
      Infrastructure: { title: "基础设施", chip: "设施" }
    }
  },
  "Micro and Still Life": {
    title: "微观与静物",
    description: "强调材质纹理、细节保真与微观尺度控制。",
    groups: {
      "Desktop Still Life": { title: "桌面静物", chip: "静物" },
      "Micro World": { title: "微观世界", chip: "微观" },
      "Material Representation": { title: "材质表现", chip: "材质" }
    }
  },
  "Fantasy and Surrealism": {
    title: "幻想与超现实",
    description: "覆盖非欧几里得结构与超现实物理场景。",
    groups: {
      "Fantasy / Surreal": { title: "幻想 / 超现实", chip: "幻想" }
    }
  },
  "Artistic Styles": {
    title: "艺术风格",
    description: "在保证 3D 一致性的同时保持风格多样性。",
    groups: {
      "Stylized Rendering": { title: "风格化渲染", chip: "风格" }
    }
  },
  "Dynamic Data Subset": {
    title: "动态数据子集",
    description: "用于周期性动态阶段训练的高熵运动场景。",
    groups: {
      "Dynamic Scenes": { title: "动态场景", chip: "动态" }
    }
  }
};

const uiText = {
  emptyCard: isZh ? "可在 main.js 中补充该子类视频内容" : "Add videos for this sub-category in main.js",
  promptPrefix: isZh ? "提示词：" : "Prompt: "
};

const taxonomySections = [
  {
    title: "Natural Landscapes",
    description: "Large-scale geometry, fluid structures, and atmospheric consistency.",
    groups: [
      {
        title: "Landforms",
        chip: "Landforms",
        items: [
          {
            src: "videos/examples/0000.mp4",
            prompt: "camera move left - deep canyon walls made of layered rock"
          },
          {
            src: "videos/examples/0004.mp4",
            prompt: "camera push in - vast polar ice field"
          },
          {
            src: "videos/examples/0018.mp4",
            prompt: "camera orbit right then push in - forest of towering fungi glowing softly"
          }
        ]
      },
      {
        title: "Water Features",
        chip: "Water",
        items: [
          {
            src: "videos/examples/0001.mp4",
            prompt: "powerful waterfall cascading down a moss cliff"
          },
          {
            src: "videos/examples/0002.mp4",
            prompt: "camera push in - deep sea coral reefs"
          },
          {
            src: "videos/examples/0130.mp4",
            prompt: "camera push in - dramatic ocean whirlpool"
          }
        ]
      },
      {
        title: "Weather & Time",
        chip: "Atmosphere",
        items: [
          {
            src: "videos/examples/0100.mp4",
            prompt: "camera orbit right - field of wildflowers"
          },
          {
            src: "videos/examples/0234.mp4",
            prompt: "camera pan left - starry night reflected over a calm lake"
          },
          {
            src: "videos/examples/0259.mp4",
            prompt: "camera move left - falling snow in a forest at night"
          }
        ]
      }
    ]
  },
  {
    title: "Urban and Architectural",
    description: "Perspective correctness, scene permanence, and straight-line structure.",
    groups: [
      {
        title: "Urban Landscapes",
        chip: "Urban",
        items: [
          {
            src: "videos/examples/0005.mp4",
            prompt: "camera orbit right - charming European medieval town square"
          },
          {
            src: "videos/examples/0006.mp4",
            prompt: "camera move left - modernist glass skyscrapers"
          },
          {
            src: "videos/examples/0019.mp4",
            prompt: "camera push in - futuristic city"
          }
        ]
      },
      {
        title: "Indoor Spaces",
        chip: "Indoor",
        items: [
          {
            src: "videos/examples/0458.mp4",
            prompt: "camera move left - audience in an opera house"
          },
          {
            src: "videos/examples/0432.mp4",
            prompt: "camera push in - dinosaur skeleton exhibit"
          },
          {
            src: "videos/examples/0455.mp4",
            prompt: "camera move left - washing machines in a laundromat"
          }
        ]
      },
      {
        title: "Infrastructure",
        chip: "Infra",
        items: [
          {
            src: "videos/examples/0009.mp4",
            prompt: "camera pan left - deserted industrial complex"
          },
          {
            src: "videos/examples/0574.mp4",
            prompt: "camera move left - vast bridge span"
          },
          {
            src: "videos/examples/0560.mp4",
            prompt: "camera move left - bus stop"
          }
        ]
      }
    ]
  },
  {
    title: "Micro and Still Life",
    description: "Texture fidelity, fine-grained materials, and macro-level motion control.",
    groups: [
      {
        title: "Desktop Still Life",
        chip: "Still Life",
        items: [
          {
            src: "videos/examples/0010.mp4",
            prompt: "delicate afternoon tea set with macarons"
          },
          {
            src: "videos/examples/0011.mp4",
            prompt: "dried wildflowers arrangement"
          },
          {
            src: "videos/examples/0511.mp4",
            prompt: "camera move right then push in - candle still life"
          }
        ]
      },
      {
        title: "Micro World",
        chip: "Micro",
        items: [
          {
            src: "videos/examples/0012.mp4",
            prompt: "camera move left - miniature tilt-shift landscape model"
          },
          {
            src: "videos/examples/0013.mp4",
            prompt: "complex internal structure"
          },
          {
            src: "videos/examples/0754.mp4",
            prompt: "camera orbit right - crystalline micro structure"
          }
        ]
      },
      {
        title: "Material Representation",
        chip: "Material",
        items: [
          {
            src: "videos/examples/0014.mp4",
            prompt: "camera orbit right - ice cubes floating in whiskey"
          },
          {
            src: "videos/examples/0844.mp4",
            prompt: "camera orbit left - diamond gemstone"
          },
          {
            src: "videos/examples/1540.mp4",
            prompt: "glowing jellyfish bell detail"
          }
        ]
      }
    ]
  },
  {
    title: "Fantasy and Surrealism",
    description: "Non-Euclidean structures and physics-defying scenes.",
    groups: [
      {
        title: "Fantasy / Surreal",
        chip: "Fantasy",
        items: [
          {
            src: "videos/examples/0016.mp4",
            prompt: "camera pull out - surreal melting clocks draped over branches"
          },
          {
            src: "videos/examples/0972.mp4",
            prompt: "camera orbit left - floating monastery above the clouds"
          },
          {
            src: "videos/examples/0020.mp4",
            prompt: "camera pull out - whimsical cityscape"
          }
        ]
      }
    ]
  },
  {
    title: "Artistic Styles",
    description: "Style diversity while preserving 3D consistency.",
    groups: [
      {
        title: "Stylized Rendering",
        chip: "Style",
        items: [
          {
            src: "videos/examples/0021.mp4",
            prompt: "water lily pond with Japanese bridge"
          },
          {
            src: "videos/examples/0022.mp4",
            prompt: "camera push in - traditional Chinese ink-wash scene"
          },
          {
            src: "videos/examples/0023.mp4",
            prompt: "static camera - Japanese ukiyo-e woodblock style"
          }
        ]
      }
    ]
  },
  {
    title: "Dynamic Data Subset",
    description: "High-entropy prompts used in periodic dynamic-only training.",
    groups: [
      {
        title: "Dynamic Scenes",
        chip: "Dynamic",
        items: [
          {
            src: "videos/dynamic/0000.mp4",
            prompt: "lion roaring with mane shaking in the wind"
          },
          {
            src: "videos/dynamic/0008.mp4",
            prompt: "soldiers marching in synchronization"
          },
          {
            src: "videos/dynamic/0013.mp4",
            prompt: "drone flying through a corridor"
          },
          {
            src: "videos/dynamic/0011.mp4",
            prompt: "hacker typing furiously on a keyboard"
          },
          {
            src: "videos/dynamic/0020.mp4",
            prompt: "fighter jet performance"
          },
          {
            src: "videos/dynamic/0034.mp4",
            prompt: "flock of birds taking off from a lake"
          }
        ]
      }
    ]
  }
];

const comparisonRows = [
  {
    prompt: "Camera push in. Deep canyon walls made of layered red rock, with a winding river at the bottom.",
    models: [
      {
        name: "World-R1-Large",
        src: "videos/baseline_comparation/world-r1-large/0000.mp4"
      },
      {
        name: "Wan2.2-T2V-14B",
        src: "videos/baseline_comparation/wan2.2-14b/0000.mp4"
      },
      {
        name: "Wan2.1-T2V-14B",
        src: "videos/baseline_comparation/wan2.1-14b/0000.mp4"
      }
    ]
  },
  {
    prompt: "Camera orbit left, then push in. Deep sea coral reefs teeming with colorful fish and bioluminescent plant life.",
    models: [
      {
        name: "World-R1-Large",
        src: "videos/baseline_comparation/world-r1-large/0002.mp4"
      },
      {
        name: "Wan2.2-T2V-14B",
        src: "videos/baseline_comparation/wan2.2-14b/0002.mp4"
      },
      {
        name: "Wan2.1-T2V-14B",
        src: "videos/baseline_comparation/wan2.1-14b/0002.mp4"
      }
    ]
  },
  {
    prompt: "Camera move left. Modernist glass skyscrapers reflecting the Shanghai Bund waterfront during golden hour.",
    models: [
      {
        name: "World-R1-Small",
        src: "videos/baseline_comparation/world-r1-small/0006.mp4"
      },
      {
        name: "Wan2.1-T2V-1.3B",
        src: "videos/baseline_comparation/wan2.1-1.3b/0006.mp4"
      },
      {
        name: "CogVideoX-1.5-5B",
        src: "videos/baseline_comparation/cogvideox-1.5-5b/0006.mp4"
      }
    ]
  }
];

const heroSources = [
  "videos/examples/0000.mp4",
  "videos/examples/0001.mp4",
  "videos/examples/0002.mp4",
  "videos/examples/0004.mp4",
  "videos/examples/0005.mp4",
  "videos/examples/0006.mp4",
  "videos/examples/0009.mp4",
  "videos/examples/0018.mp4",
  "videos/examples/0019.mp4",
  "videos/examples/0100.mp4",
  "videos/examples/0130.mp4",
  "videos/examples/0234.mp4",
  "videos/examples/0259.mp4",
  "videos/examples/0432.mp4",
  "videos/examples/0455.mp4",
  "videos/examples/0458.mp4",
  "videos/examples/0560.mp4",
  "videos/examples/0574.mp4",
  "videos/dynamic/0000.mp4",
  "videos/dynamic/0008.mp4",
  "videos/dynamic/0011.mp4",
  "videos/dynamic/0013.mp4",
  "videos/dynamic/0020.mp4",
  "videos/dynamic/0034.mp4"
];

const configureVideo = (video, src, { lazy = false, preload = lazy ? "none" : "metadata" } = {}) => {
  if (!video) return;
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = preload;

  const resolvedSrc = `${assetBase}${src}`;
  if (lazy) {
    video.dataset.src = resolvedSrc;
    video.dataset.lazy = "true";
    return;
  }

  video.src = resolvedSrc;
};

const loadVideoSource = (video, { preload = "auto" } = {}) => {
  if (!video || video.dataset.loaded === "true") return;
  const src = video.dataset.src;
  if (!src) return;
  video.preload = preload;
  video.src = src;
  video.dataset.loaded = "true";
  video.load();
};

const safePlay = (video) => {
  if (!video) return;
  const promise = video.play();
  if (promise && typeof promise.catch === "function") {
    promise.catch(() => {});
  }
};

const buildVideoCard = (item, chipText) => {
  const card = document.createElement("article");
  card.className = "video-card";

  const shell = document.createElement("div");
  shell.className = "video-shell";

  const video = document.createElement("video");
  configureVideo(video, item.src, { lazy: true });

  const chip = document.createElement("span");
  chip.className = "chip";
  chip.textContent = chipText;

  const prompt = document.createElement("p");
  prompt.className = "prompt";
  prompt.textContent = item.prompt;

  shell.appendChild(video);
  shell.appendChild(chip);
  card.appendChild(shell);
  card.appendChild(prompt);
  return card;
};

const buildEmptyCard = (message) => {
  const card = document.createElement("article");
  card.className = "empty-card";
  card.textContent = message;
  return card;
};

const renderVideoGrid = (container, items, chipText) => {
  if (!container) return;
  const fragment = document.createDocumentFragment();

  if (!items || items.length === 0) {
    fragment.appendChild(buildEmptyCard(uiText.emptyCard));
  } else {
    items.forEach((item) => fragment.appendChild(buildVideoCard(item, chipText)));
  }

  container.appendChild(fragment);
};

const renderTaxonomySections = () => {
  const mount = document.getElementById("taxonomy-sections");
  if (!mount) return;

  const fragment = document.createDocumentFragment();

  taxonomySections.forEach((section) => {
    const sectionBlock = document.createElement("section");
    sectionBlock.className = "taxonomy-section-block";

    const head = document.createElement("header");
    head.className = "taxonomy-section-head";

    const localizedSection = isZh ? taxonomyI18n[section.title] : null;

    const title = document.createElement("h3");
    title.textContent = localizedSection?.title || section.title;

    const desc = document.createElement("p");
    desc.textContent = localizedSection?.description || section.description;

    head.appendChild(title);
    head.appendChild(desc);
    sectionBlock.appendChild(head);

    section.groups.forEach((group) => {
      const localizedGroup = localizedSection?.groups?.[group.title];
      const groupBlock = document.createElement("article");
      groupBlock.className = "taxonomy-subsection";

      const groupTitle = document.createElement("h4");
      groupTitle.textContent = localizedGroup?.title || group.title;

      const grid = document.createElement("div");
      grid.className = "video-grid";

      renderVideoGrid(grid, group.items, localizedGroup?.chip || group.chip || group.title);

      groupBlock.appendChild(groupTitle);
      groupBlock.appendChild(grid);
      sectionBlock.appendChild(groupBlock);
    });

    fragment.appendChild(sectionBlock);
  });

  mount.appendChild(fragment);
};

const renderComparisons = () => {
  const container = document.getElementById("comparison-list");
  if (!container) return;

  const fragment = document.createDocumentFragment();

  comparisonRows.forEach((row) => {
    const block = document.createElement("article");
    block.className = "comparison-block";

    const prompt = document.createElement("h3");
    prompt.className = "comparison-prompt";
    prompt.textContent = `${uiText.promptPrefix}${row.prompt}`;

    const grid = document.createElement("div");
    grid.className = "comparison-grid";

    row.models.forEach((model) => {
      const card = document.createElement("div");
      card.className = "model-card";

      const name = document.createElement("p");
      name.className = "model-name";
      name.textContent = model.name;

      const video = document.createElement("video");
      configureVideo(video, model.src, { lazy: true });

      card.appendChild(name);
      card.appendChild(video);
      grid.appendChild(card);
    });

    block.appendChild(prompt);
    block.appendChild(grid);
    fragment.appendChild(block);
  });

  container.appendChild(fragment);
};

const initHeroCarousel = () => {
  const heroVideo = document.getElementById("hero-video");
  const heroVideoNext = document.getElementById("hero-video-next");
  if (!heroVideo || !heroVideoNext || heroSources.length === 0) return null;

  const sources = [...heroSources].sort(() => Math.random() - 0.5);

  const setSource = (video, src) => {
    video.preload = "auto";
    video.src = `${assetBase}${src}`;
    video.load();
    safePlay(video);
  };

  let current = 0;
  let active = heroVideo;
  let inactive = heroVideoNext;

  setSource(active, sources[current]);
  active.classList.add("active");

  if (sources.length === 1) return active;

  setInterval(() => {
    const next = (current + 1) % sources.length;
    setSource(inactive, sources[next]);
    inactive.oncanplay = () => {
      inactive.classList.add("active");
      active.classList.remove("active");
      const temp = active;
      active = inactive;
      inactive = temp;
      current = next;
      inactive.oncanplay = null;
    };
  }, 9000);

  return active;
};

const heroLeadVideo = initHeroCarousel();
renderTaxonomySections();
renderComparisons();

const homeNav = document.querySelector(".home-page .hero-nav");
const heroSection = document.querySelector(".home-page .hero");
if (homeNav && heroSection) {
  const updateNav = () => {
    const trigger = heroSection.offsetHeight - 110;
    if (window.scrollY > trigger) {
      homeNav.classList.add("scrolled");
    } else {
      homeNav.classList.remove("scrolled");
    }
  };
  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });
}

const videos = Array.from(document.querySelectorAll("video"));
const lazyVideos = videos.filter((video) => video.dataset.lazy === "true");

const activateVideo = (video) => {
  loadVideoSource(video, { preload: "auto" });
  safePlay(video);
};

const isMostlyVisible = (video) => {
  const rect = video.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return false;

  const visibleWidth = Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0);
  const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
  return visibleWidth / rect.width > 0.25 && visibleHeight / rect.height > 0.25;
};

const isBufferedToEnd = (video) => {
  if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return false;
  if (!video.buffered || video.buffered.length === 0) return false;
  return video.buffered.end(video.buffered.length - 1) >= video.duration - 0.25;
};

const initBackgroundPreload = (heroVideo) => {
  if (!heroVideo || lazyVideos.length === 0) return;

  let started = false;
  let cursor = 0;
  let inFlight = 0;
  const maxConcurrent = 2;

  const maybeStart = () => {
    if (started) return;
    if (heroVideo.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA && !isBufferedToEnd(heroVideo)) return;
    started = true;
    heroVideo.removeEventListener("loadeddata", maybeStart);
    heroVideo.removeEventListener("progress", maybeStart);
    pump();
  };

  const pump = () => {
    while (started && inFlight < maxConcurrent && cursor < lazyVideos.length) {
      const video = lazyVideos[cursor++];
      if (video.dataset.loaded === "true") continue;

      inFlight += 1;
      loadVideoSource(video, { preload: "auto" });

      let released = false;
      const release = () => {
        if (released) return;
        released = true;
        video.removeEventListener("loadeddata", release);
        video.removeEventListener("canplay", release);
        video.removeEventListener("error", release);
        inFlight = Math.max(0, inFlight - 1);
        pump();
      };

      video.addEventListener("loadeddata", release, { once: true });
      video.addEventListener("canplay", release, { once: true });
      video.addEventListener("error", release, { once: true });
      window.setTimeout(release, 1200);
    }
  };

  heroVideo.addEventListener("loadeddata", maybeStart);
  heroVideo.addEventListener("progress", maybeStart);
  heroVideo.addEventListener("canplaythrough", maybeStart, { once: true });
  maybeStart();
};

initBackgroundPreload(heroLeadVideo);

if ("IntersectionObserver" in window) {
  const loadObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadVideoSource(entry.target, { preload: "auto" });
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "600px 0px",
      threshold: 0.01
    }
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
          activateVideo(video);
        } else {
          video.pause();
        }
      });
    },
    { threshold: [0, 0.25, 0.6] }
  );

  videos.forEach((video) => {
    observer.observe(video);
    if (video.dataset.lazy === "true") {
      loadObserver.observe(video);
    }
  });
} else {
  videos.forEach((video) => activateVideo(video));
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    videos.forEach((video) => video.pause());
  } else {
    videos.forEach((video) => {
      if (isMostlyVisible(video)) {
        activateVideo(video);
      } else {
        video.pause();
      }
    });
  }
});
