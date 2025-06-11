document.addEventListener("DOMContentLoaded", async () => {
  setupHamburgerMenu();
  await loadExperience();
  await loadProjects();
  await loadCertificates();
});

function setupHamburgerMenu() {
  const hamburger = document.getElementById("HamburgerIcon");
  const links = document.getElementById("LinkContainer");
  if (hamburger && links) {
    hamburger.addEventListener("click", () => {
      links.classList.toggle("show");
    });
  }
}

async function fetchJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function loadProjects() {
  const projectGrid = document.querySelector(".ProjectGridContainer");
  const filterContainer = document.querySelector(".FilterContainer");
  const basePath = "json/projects/";

  try {
    const res = await fetch(basePath);
    const text = await res.text();
    const folders = [...text.matchAll(/href="([^"]+\/)"/g)]
      .map(m => m[1].replace(/^\/+|\/+$/g, ""))
      .filter(f => f !== "..");

    const categoriesSet = new Set();

    for (const folder of folders) {
      const json = await fetchJSON(`${basePath}${folder}/data.json`);
      if (!json) continue;

      let image = "";
      const imgPath = `${basePath}${folder}/image.webp`;
      try {
        const imgRes = await fetch(imgPath);
        if (imgRes.ok) image = imgPath;
      } catch {}

      categoriesSet.add(json.category);

      const card = document.createElement("div");
      card.className = "ProjectCard";
      card.setAttribute("data-category", json.category);
      card.innerHTML = `
        <div class="ProjectCardInner">
          <div class="ProjectCardFront">
            <img src="${image}" alt="Project Image" class="projectImage" />
            <div class="category">${json.category}</div>
          </div>
          <div class="ProjectCardBack">
            <p class="title">${json.title}</p>
            <p class="description">${json.description}</p>
            <hr />
            <a href="${json.github_link}" class="github-link">
              <img src="img/github.webp" alt="GitHub" />
            </a>
          </div>
        </div>`;
      projectGrid.appendChild(card);
    }

    // Filter Buttons
    filterContainer.innerHTML = `<button class="filter-btn active" data-category="all">All</button>`;
    [...categoriesSet].sort().forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "filter-btn";
      btn.setAttribute("data-category", cat);
      btn.textContent = cat;
      filterContainer.appendChild(btn);
    });

    // Filter Logic
    document.querySelectorAll(".filter-btn").forEach(button => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        const category = button.getAttribute("data-category");
        document.querySelectorAll(".ProjectCard").forEach(card => {
          const cardCategory = card.getAttribute("data-category");
          card.style.display = category === "all" || cardCategory === category ? "block" : "none";
        });
      });
    });
  } catch (e) {
    console.error("Error loading projects:", e);
  }
}

async function loadExperience() {
  const timeline = document.querySelector(".ExperienceTimeline");
  const basePath = "json/experience/";

  try {
    const res = await fetch(basePath);
    const text = await res.text();
    const files = [...text.matchAll(/href="([^"]+\.json)"/g)]
      .map(m => m[1])
      .reverse();

    for (const file of files) {
      const json = await fetchJSON(`${basePath}${file}`);
      if (!json) continue;

      const card = document.createElement("div");
      card.className = "ExperienceCard";
      card.innerHTML = `
        <div class="ExperienceContent">
          <div class="ExperienceRole"><p>${json.Role}</p></div>
          <div class="ExperienceCompany"><p>${json.Company}</p></div>
          <div class="ExperienceDuration"><p>${json.Duration}</p></div>
          <div class="ExperienceDescription"><p>${json.Description}</p></div>
        </div>`;
      timeline.appendChild(card);
    }
  } catch (e) {
    console.error("Error loading experience:", e);
  }
}

async function loadCertificates() {
  const certGrid = document.querySelector(".CertificateGridContainer");
  const basePath = "json/certificates/";

  try {
    const res = await fetch(basePath);
    const text = await res.text();
    const folders = [...text.matchAll(/href="([^"]+\/)"/g)]
      .map(m => m[1].replace(/^\/+|\/+$/g, ""))
      .filter(f => f !== "..");

    for (const folder of folders) {
      const json = await fetchJSON(`${basePath}${folder}/data.json`);
      if (!json) continue;

      let image = "";
      const imgPath = `${basePath}${folder}/image.webp`;
      try {
        const imgRes = await fetch(imgPath);
        if (imgRes.ok) image = imgPath;
      } catch {}

      const card = document.createElement("div");
      card.className = "CertificateCard";
      card.innerHTML = `
        <div class="CertificateCardInner">
          <div class="CertificateCardFront">
            <img src="${image}" alt="Certificate Image" class="CertificateImage" />
          </div>
          <div class="CertificateCardBack">
            <p class="title">${json.title}</p>
            <p class="description">${json.description}</p>
            <hr />
          </div>
        </div>`;
      certGrid.appendChild(card);
    }
  } catch (e) {
    console.error("Error loading certificates:", e);
  }
}
