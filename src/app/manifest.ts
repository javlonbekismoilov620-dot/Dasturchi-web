import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dasturchi — o‘zbek tilidagi ta’lim platformasi",
    short_name: "Dasturchi",
    description: "IT, dizayn, 3D va video montajni noldan professional darajagacha o‘rganing.",
    start_url: "/",
    display: "standalone",
    background_color: "#08080a",
    theme_color: "#08080a",
    lang: "uz",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
