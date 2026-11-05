<!--
SPDX-FileCopyrightText: © 2026 Joseph Maldjian <joseph.maldjian@hyecompany.com>
SPDX-License-Identifier: Apache-2.0
-->

# Incus UI
Manage your [Incus](https://github.com/lxc/incus) deployment from the web.

## Showcase
<img width="3588" height="2160" alt="localhost_3000_ui_instances (1)" src="https://github.com/user-attachments/assets/ac32ebb4-12ea-412b-9ae8-6715bf29a282" />

<p align="center">Incus UI Application Shell</p>

## Roadmap
Incus UI is currently in its infancy and **its foundation is still under construction** 🏗️. The first release (v0.1) is scheduled for November 12th, which will cement this foundation. From there, robust primitive implementation will begin.

We follow a semi-monthly release cycle, shipping a release alongside each monthly Incus feature update, and an additional release in-between.

For a holistic detailed roadmap for each planned version, see our [GitHub Milestones](https://github.com/lxc/incus-ui/milestones).

Below is a high-level summary of our progress supporting the foundational Incus primitives and their target releases. This list will be updated as more support is implemented over time.

- [ ] **Projects**
  - [ ] Listing & switching (v0.1).
- [ ] **Server/Cluster**
  - [ ] TLS Client Certificate Authentication (v0.1)
  - [ ] OpenID Connect (v0.1)
  - [ ] CLI Authentication Flows (v0.1)

- [ ] **Instances**
- [ ] **Storage**
- [ ] **Networks**
- [ ] **Images**
- [ ] **Profiles**

## Installation
### Prerequisites
Incus UI supports the latest Incus release [in each actively maintained Incus channel](https://linuxcontainers.org/incus/docs/main/support/), starting with Incus 7. <!-- The [release notes](https://github.com/lxc/incus-ui/releases) contain the Incus versions supported by each Incus UI release. -->

### Instructions
#### 1. Download an Incus UI Archive
##### Edge Builds
As the first version of Incus UI has not yet released, this is the **only version available** to install until 11/12/2026.

Edge builds are compiled as code is merged into the main branch. These <!-- are not officially supported, however, --> grant you access to features before they appear in the upcoming release.

Download the `incus-ui.tar.gz` artifact from a successful run of the [Build Edge workflow](https://github.com/lxc/incus-ui/actions/workflows/build-edge.yml). GitHub Actions downloads artifacts as zip files, so unzip the download first to obtain `incus-ui.tar.gz`.

#### 2. Extract the archive to your Incus UI directory

If you installed Incus using a Zabbly package, use `/opt/incus/ui` as follows:
```
mkdir -p /opt/incus/ui
tar -xzf incus-ui.tar.gz -C /opt/incus/ui
```

If you installed Incus through another route, set the `INCUS_UI` environment variable for `incusd` to your preferred path, and extract Incus UI there.

If you have already previously installed a UI to this path, you will need to remove it (e.g. `rm -r /opt/incus/ui`).

#### 3. Restart Incus
If you use systemd, use:
```
systemctl restart incus
```

### Accessing Incus UI
Simply visit your Incus host in the browser, and Incus UI will be served.

<!-- ### Build from Source -->

