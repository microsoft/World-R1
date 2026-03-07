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
  promptPrefix: isZh ? "提示词 - " : "Prompt - "
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
            src: "videos/examples/0000_camera_push_in_then_pan_right_deep_canyon_walls_made_of_laye.mp4",
            prompt: "camera push in then pan right - deep canyon walls made of layered rock"
          },
          {
            src: "videos/examples/0004_camera_move_right_pull_out_then_pan_right_a_vast_polar_ice_f.mp4",
            prompt: "camera move right pull out then pan right - vast polar ice field"
          },
          {
            src: "videos/examples/0018_camera_push_in_a_forest_of_towering_fungi_that_glow_with_sof.mp4",
            prompt: "camera push in - forest of towering fungi glowing softly"
          }
        ]
      },
      {
        title: "Water Features",
        chip: "Water",
        items: [
          {
            src: "videos/examples/0001_camera_orbit_left_a_powerful_waterfall_cascading_down_a_moss.mp4",
            prompt: "camera orbit left - powerful waterfall cascading down a moss cliff"
          },
          {
            src: "videos/examples/0002_camera_pull_out_then_move_left_deep_sea_coral_reefs_teeming_.mp4",
            prompt: "camera pull out then move left - deep sea coral reefs"
          }
        ]
      },
      {
        title: "Weather & Time",
        chip: "Atmosphere",
        items: [
          {
            src: "videos/examples/0003_camera_pan_right_wide_grasslands_under_a_dramatic_sky_filled.mp4",
            prompt: "camera pan right - wide grasslands under a dramatic sky"
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
            src: "videos/examples/0005_camera_move_left_a_charming_european_medieval_town_square_wi.mp4",
            prompt: "camera move left - charming European medieval town square"
          },
          {
            src: "videos/examples/0006_camera_push_in_then_pan_left_modernist_glass_skyscrapers_ref.mp4",
            prompt: "camera push in then pan left - modernist glass skyscrapers"
          },
          {
            src: "videos/examples/0019_camera_orbit_left_then_move_right_a_futuristic_city_built_fr.mp4",
            prompt: "camera orbit left then move right - futuristic city"
          }
        ]
      },
      {
        title: "Indoor Spaces",
        chip: "Indoor",
        items: [
          {
            src: "videos/examples/0007_camera_pull_out_the_interior_of_a_magnificent_gothic_cathedr.mp4",
            prompt: "camera pull out - interior of a magnificent gothic cathedral"
          },
          {
            src: "videos/examples/0008_camera_orbit_right_then_push_in_a_cozy_attic_study_filled_wi.mp4",
            prompt: "camera orbit right then push in - cozy attic study"
          }
        ]
      },
      {
        title: "Infrastructure",
        chip: "Infra",
        items: [
          {
            src: "videos/examples/0009_camera_move_left_pull_out_then_pan_left_a_deserted_industria.mp4",
            prompt: "camera move left pull out then pan left - deserted industrial complex"
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
            src: "videos/examples/0010_camera_push_in_a_delicate_afternoon_tea_set_with_macarons_an.mp4",
            prompt: "camera push in - delicate afternoon tea set with macarons"
          },
          {
            src: "videos/examples/0011_camera_pan_right_then_orbit_left_dried_wildflowers_arranged_.mp4",
            prompt: "camera pan right then orbit left - dried wildflowers arrangement"
          }
        ]
      },
      {
        title: "Micro World",
        chip: "Micro",
        items: [
          {
            src: "videos/examples/0012_camera_move_right_a_miniature_tilt_shift_landscape_model_of_.mp4",
            prompt: "camera move right - miniature tilt-shift landscape model"
          },
          {
            src: "videos/examples/0013_camera_pull_out_then_pan_left_the_complex_internal_structure.mp4",
            prompt: "camera pull out then pan left - complex internal structure"
          }
        ]
      },
      {
        title: "Material Representation",
        chip: "Material",
        items: [
          {
            src: "videos/examples/0014_camera_orbit_right_ice_cubes_floating_in_a_glass_of_whiskey_.mp4",
            prompt: "camera orbit right - ice cubes floating in whiskey"
          },
          {
            src: "videos/examples/0015_camera_push_in_then_fixed_heavy_silk_curtains_with_an_embroi.mp4",
            prompt: "camera push in then fixed - heavy silk curtains with embroidery"
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
            src: "videos/examples/0016_camera_pan_left_surreal_melting_clocks_draped_over_tree_bran.mp4",
            prompt: "camera pan left - surreal melting clocks draped over branches"
          },
          {
            src: "videos/examples/0017_camera_move_right_pull_out_then_pan_right_giant_spheres_of_s.mp4",
            prompt: "camera move right pull out then pan right - giant surreal spheres"
          },
          {
            src: "videos/examples/0020_camera_pull_out_then_pan_right_a_whimsical_city_constructed_.mp4",
            prompt: "camera pull out then pan right - whimsical cityscape"
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
            src: "videos/examples/0021_camera_pan_right_a_water_lily_pond_with_a_japanese_bridge_pa.mp4",
            prompt: "camera pan right - water lily pond with Japanese bridge"
          },
          {
            src: "videos/examples/0022_camera_orbit_right_then_push_in_a_traditional_chinese_ink_wa.mp4",
            prompt: "camera orbit right then push in - traditional Chinese ink-wash scene"
          },
          {
            src: "videos/examples/0023_camera_move_left_then_pull_out_a_japanese_ukiyo_e_woodblock_.mp4",
            prompt: "camera move left then pull out - Japanese ukiyo-e woodblock style"
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
            src: "videos/dynamic/0000_camera_push_in_a_lion_roaring_with_its_mane_shaking_in_the_w.mp4",
            prompt: "camera push in - lion roaring with mane shaking in the wind"
          },
          {
            src: "videos/dynamic/0008_camera_pan_left_soldiers_marching_in_synchronization_across_.mp4",
            prompt: "camera pan left - soldiers marching in synchronization"
          },
          {
            src: "videos/dynamic/0013_camera_pan_right_then_orbit_left_a_drone_flying_through_a_co.mp4",
            prompt: "camera pan right then orbit left - drone flying through a corridor"
          },
          {
            src: "videos/dynamic/0014_camera_move_left_a_bartender_shaking_a_cocktail_mixer_vigoro.mp4",
            prompt: "camera move left - bartender shaking a cocktail mixer"
          },
          {
            src: "videos/dynamic/0020_camera_move_right_pull_out_then_pan_right_a_fighter_jet_perf.mp4",
            prompt: "camera move right pull out then pan right - fighter jet performance"
          },
          {
            src: "videos/dynamic/0034_camera_pull_out_a_flock_of_birds_taking_off_from_a_lake.mp4",
            prompt: "camera pull out - flock of birds taking off from a lake"
          }
        ]
      }
    ]
  }
];

const comparisonRows = [
  {
    prompt: "camera push in then pan right - deep canyon walls made of layered rock",
    models: [
      {
        name: "World-R1 Large",
        src: "videos/baseline_comparation/world-r1-large/0000_camera_push_in_then_pan_right_deep_canyon_walls_made_of_laye.mp4"
      },
      {
        name: "Wan 2.2 14B",
        src: "videos/baseline_comparation/wan2.2-14b/0000_camera_push_in_then_pan_right_deep_canyon_walls_made_of_laye.mp4"
      },
      {
        name: "Wan 2.1 14B",
        src: "videos/baseline_comparation/wan2.1-14b/0000_camera_push_in_then_pan_right_deep_canyon_walls_made_of_laye.mp4"
      }
    ]
  },
  {
    prompt: "camera pull out then move left - deep sea coral reefs teeming",
    models: [
      {
        name: "World-R1 Large",
        src: "videos/baseline_comparation/world-r1-large/0002_camera_pull_out_then_move_left_deep_sea_coral_reefs_teeming_.mp4"
      },
      {
        name: "Wan 2.2 14B",
        src: "videos/baseline_comparation/wan2.2-14b/0002_camera_pull_out_then_move_left_deep_sea_coral_reefs_teeming_.mp4"
      },
      {
        name: "Wan 2.1 14B",
        src: "videos/baseline_comparation/wan2.1-14b/0002_camera_pull_out_then_move_left_deep_sea_coral_reefs_teeming_.mp4"
      }
    ]
  },
  {
    prompt: "camera push in then pan left - modernist glass skyscrapers",
    models: [
      {
        name: "World-R1 Small",
        src: "videos/baseline_comparation/world-r1-small/0006_camera_push_in_then_pan_left_modernist_glass_skyscrapers_ref.mp4"
      },
      {
        name: "Wan 2.1 1.3B",
        src: "videos/baseline_comparation/wan2.1-1.3b/0006_camera_push_in_then_pan_left_modernist_glass_skyscrapers_ref.mp4"
      },
      {
        name: "CogVideoX 1.5 5B",
        src: "videos/baseline_comparation/cogvideox-1.5-5b/0006_camera_push_in_then_pan_left_modernist_glass_skyscrapers_ref.mp4"
      }
    ]
  },
  {
    prompt: "camera orbit left then move right - futuristic city",
    models: [
      {
        name: "World-R1 Small",
        src: "videos/baseline_comparation/world-r1-small/0019_camera_orbit_left_then_move_right_a_futuristic_city_built_fr.mp4"
      },
      {
        name: "Wan 2.1 1.3B",
        src: "videos/baseline_comparation/wan2.1-1.3b/0019_camera_orbit_left_then_move_right_a_futuristic_city_built_fr.mp4"
      },
      {
        name: "CogVideoX 1.5 5B",
        src: "videos/baseline_comparation/cogvideox-1.5-5b/0019_camera_orbit_left_then_move_right_a_futuristic_city_built_fr.mp4"
      }
    ]
  }
];

const heroSources = [
  "videos/examples/0001_camera_orbit_left_a_powerful_waterfall_cascading_down_a_moss.mp4",
  "videos/examples/0006_camera_push_in_then_pan_left_modernist_glass_skyscrapers_ref.mp4",
  "videos/examples/0016_camera_pan_left_surreal_melting_clocks_draped_over_tree_bran.mp4",
  "videos/examples/0022_camera_orbit_right_then_push_in_a_traditional_chinese_ink_wa.mp4",
  "videos/dynamic/0000_camera_push_in_a_lion_roaring_with_its_mane_shaking_in_the_w.mp4"
];

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
  video.src = `${assetBase}${item.src}`;
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "metadata";

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
      video.src = `${assetBase}${model.src}`;
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "metadata";

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
  if (!heroVideo || !heroVideoNext || heroSources.length === 0) return;

  const setSource = (video, src) => {
    video.src = `${assetBase}${src}`;
    video.load();
    safePlay(video);
  };

  let current = 0;
  let active = heroVideo;
  let inactive = heroVideoNext;

  setSource(active, heroSources[current]);
  active.classList.add("active");

  if (heroSources.length === 1) return;

  setInterval(() => {
    const next = (current + 1) % heroSources.length;
    setSource(inactive, heroSources[next]);
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
};

renderTaxonomySections();
renderComparisons();
initHeroCarousel();

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

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
          safePlay(video);
        } else {
          video.pause();
        }
      });
    },
    { threshold: [0, 0.25, 0.6] }
  );

  videos.forEach((video) => observer.observe(video));
} else {
  videos.forEach((video) => safePlay(video));
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    videos.forEach((video) => video.pause());
  } else {
    videos.forEach((video) => safePlay(video));
  }
});
