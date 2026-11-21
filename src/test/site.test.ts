import { describe, expect, it } from "vitest";
import { SERVICES, SITE } from "@/lib/site";

describe("business details", () => {
  it("uses the real name, phone and address", () => {
    expect(SITE.name).toBe("Лаборатория АКПП");
    expect(SITE.phone).toBe("+7 (961) 519-72-95");
    expect(SITE.phoneHref).toBe("tel:+79615197295");
    expect(SITE.address).toContain("Щорса, 50/1");
  });

  it("lists the transmission services with their starting prices", () => {
    const price = (title: string) => SERVICES.find((s) => s.title === title)?.price;
    expect(price("4-х фазная диагностика")).toBe("от 2 500 ₽");
    expect(price("Rebuild АКПП")).toBe("от 25 000 ₽");
    expect(price("Усиление трансмиссии")).toBe("от 30 000 ₽");
    expect(price("Ремонт гидротрансформатора")).toBe("от 9 000 ₽");
    expect(price("Робот мойка")).toBe("от 300 ₽");
    expect(SERVICES).toHaveLength(17);
  });
});
