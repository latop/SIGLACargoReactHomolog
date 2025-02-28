import React from "react";
import { RenderOptions, render } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";
import { RecoilRoot } from "recoil";

interface RecoilRenderOptions extends Omit<RenderOptions, "queries"> {}

const recoilRender = (ui: ReactElement, options?: RecoilRenderOptions) => {
  function Wrapper({ children }: { children: ReactNode }) {
    return <RecoilRoot>{children}</RecoilRoot>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
};

export * from "@testing-library/react";

export { recoilRender as render };
