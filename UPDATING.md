# Updating the upstream version

Ride The Lightning is pulled as a prebuilt image from Docker Hub. The canonical version pin lives in `startos/manifest/index.ts`; the GitHub release is the source of truth for what's actually upstream.

## Determining the upstream version

- **Ride The Lightning** ([Ride-The-Lightning/RTL](https://github.com/Ride-The-Lightning/RTL)) — latest GitHub release:

  ```
  gh release view -R Ride-The-Lightning/RTL --json tagName -q .tagName
  ```

  The pin lives in `startos/manifest/index.ts` as `images.rtl.source.dockerTag` (`shahanafarooqui/rtl:v<version>`).

- **Docker Hub image** ([shahanafarooqui/rtl](https://hub.docker.com/r/shahanafarooqui/rtl)) — confirm the matching `v<version>` tag has been published before bumping:

  ```
  curl -fsSL "https://hub.docker.com/v2/repositories/shahanafarooqui/rtl/tags?page_size=20&ordering=last_updated" | jq -r '.results[].name'
  ```

## Applying the bump

- `startos/manifest/index.ts` — set `images.rtl.source.dockerTag` to `shahanafarooqui/rtl:v<new version>`.
