const fs = require("fs");
const path = require("path");
const data = require("./data");

function getValue(obj, key) {
  return key.split(".").reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

function render(template, context) {
  return template.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (match, key) => {
    const value = getValue(context, key);
    return value === undefined || value === null ? "" : String(value);
  });
}

function buildPage({ templatePath, outputPath, langKey, pageKey }) {
  const template = fs.readFileSync(templatePath, "utf8");
  const langData = data[langKey];
  const altLangKey = langKey === "en" ? "de" : "en";

  const context = {
    site: data.site,
    ...langData,
    lang_en_class: langKey === "en" ? "is-active" : "",
    lang_de_class: langKey === "de" ? "is-active" : "",
    paths_alt: data[altLangKey].paths,
    page: {
      self_path: langData.paths[pageKey],
      alt_path: data[altLangKey].paths[pageKey]
    }
  };

  const html = render(template, context);
  fs.writeFileSync(outputPath, html, "utf8");
}

const root = path.resolve(__dirname, "..");
const templatesRoot = path.join(root, "src", "templates");

buildPage({
  templatePath: path.join(templatesRoot, "index.html"),
  outputPath: path.join(root, "index.html"),
  langKey: "en",
  pageKey: "index"
});

buildPage({
  templatePath: path.join(templatesRoot, "index.html"),
  outputPath: path.join(root, "index.de.html"),
  langKey: "de",
  pageKey: "index"
});

buildPage({
  templatePath: path.join(templatesRoot, "faqs.html"),
  outputPath: path.join(root, "faqs.html"),
  langKey: "en",
  pageKey: "faqs"
});

buildPage({
  templatePath: path.join(templatesRoot, "faqs.html"),
  outputPath: path.join(root, "faqs.de.html"),
  langKey: "de",
  pageKey: "faqs"
});

buildPage({
  templatePath: path.join(templatesRoot, "photos.html"),
  outputPath: path.join(root, "photos.html"),
  langKey: "en",
  pageKey: "photos"
});

buildPage({
  templatePath: path.join(templatesRoot, "photos.html"),
  outputPath: path.join(root, "photos.de.html"),
  langKey: "de",
  pageKey: "photos"
});
