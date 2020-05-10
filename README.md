# Folder Card

[![HACS][hacs-shield]][hacs-link]
[![Downloads][downloads-shield]][downloads-link]
[![GitHub Release][releases-shield]][releases-link]
[![CI][ci-shield]][ci-link]
[![Project Maintenance][maintenance-shield]][maintenance-link]
[![License][license-shield]][license-link]

## Overview

This is a [Lovelace](https://www.home-assistant.io/lovelace) card for [Home Assistant](https://www.home-assistant.io/) that displays files listed by a [Folder sensor](https://www.home-assistant.io/integrations/folder/).

If you define a `call-service` tap_action, the service will receive a `file` variable with the file path of the selected file.

![example](https://raw.githubusercontent.com/GeorgeSG/lovelace-folder-card/master/examples/example.png)

## Installation

Install using [HACS](https://hacs.xyz) or follow this [guide](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins)

```yaml
resources:
  - url: /local/folder-card.js
    type: module
```

## Usage

```yaml
type: 'custom:folder-card'
title: 'My file list'
icon: 'mdi:folder'
entity: sensor.folder
tap_action:
  action: 'call-service'
  service: script.use_file
```

## Options

| Name        | Type    | Requirement  | Description                                                                | Default                      |
| ----------- | ------- | ------------ | -------------------------------------------------------------------------- | ---------------------------- |
| type        | string  | **Required** | `custom:folder-card`                                                       |                              |
| title       | string  | **Optional** | Card name                                                                  | Folder's `friendly_name`     |
| icon        | string  | **Optional** | Card icon                                                                  | `none`                       |
| entity      | string  | **Optional** | [Folder](https://www.home-assistant.io/integrations/folder/) sensor entity | `none`                       |
| tap_action  | object  | **Optional** | Action to take on tap                                                      | `none`                       |
| sort        | string  | **Optional** | `"ascending"` or `"descending"`                                            | `none` - as sorted in sensor |
| max_count   | number  | **Optional** | Number of files to show. Applied after sort                                | `none` - show all files      |
| show_count  | boolean | **Optional** | Show total file count in header                                            | `false`                      |
| show_hidden | boolean | **Optional** | Show files without extension. Set to `true` to hide subfolders             | `false`                      |

## Action Options

| Name            | Type   | Requirement  | Description                                                                                                                                                                        | Default |
| --------------- | ------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| action          | string | **Required** | Action to perform (more-info, toggle, call-service, navigate url, none)                                                                                                            | `none`  |
| navigation_path | string | **Optional** | Path to navigate to (e.g. /lovelace/0/) when action defined as navigate                                                                                                            | `none`  |
| url             | string | **Optional** | URL to open on click when action is url. The URL will open in a new tab                                                                                                            | `none`  |
| service         | string | **Optional** | Service to call (e.g. media_player.media_play_pause) when action defined as call-service                                                                                           | `none`  |
| service_data    | object | **Optional** | Service data to include (e.g. entity_id: media_player.bedroom) when action defined as call-service. **Automatically adds "file" property with the file addrerss to service_data**. | `none`  |
| haptic          | string | **Optional** | Haptic feedback for the [Beta IOS App](http://home-assistant.io/ios/beta) _success, warning, failure, light, medium, heavy, selection_                                             | `none`  |
| repeat          | number | **Optional** | How often to repeat the `hold_action` in milliseconds.                                                                                                                             | `none`  |

## Meta

**Georgi Gardev**

- [gar.dev](https://gar.dev)
- [![GitHub][github-icon]][github-link] [GeorgeSG][github-link]
- [![Twitter][twitter-icon]][twitter-link] [@georgesg92][twitter-link]

[hacs-shield]: https://img.shields.io/badge/HACS-Default-brightgreen.svg
[hacs-link]: https://github.com/custom-components/hacs
[downloads-shield]: https://img.shields.io/github/downloads/GeorgeSG/lovelace-folder-card/latest/total?color=brightgreen&logo=github
[downloads-link]: https://github.com/GeorgeSG/lovelace-folder-card/releases
[releases-shield]: https://img.shields.io/github/release/GeorgeSG/lovelace-folder-card.svg
[releases-link]: https://github.com/GeorgeSG/lovelace-folder-card/releases
[ci-shield]: https://img.shields.io/github/workflow/status/GeorgeSG/lovelace-folder-card/CI?label=CI&logo=github&
[ci-link]: https://github.com/GeorgeSG/lovelace-folder-card/actions?query=workflow%3ACI
[maintenance-shield]: https://img.shields.io/maintenance/yes/2020.svg
[maintenance-link]: https://github.com/GeorgeSG/lovelace-folder-card
[license-shield]: https://img.shields.io/github/license/GeorgeSG/lovelace-folder-card?color=brightgreen
[license-link]: https://github.com/GeorgeSG/lovelace-folder-card/blob/master/LICENSE
[github-icon]: http://i.imgur.com/9I6NRUm.png
[github-link]: https://github.com/GeorgeSG/

[twitter-icon]: http://i.imgur.com/wWzX9uB.png
[twitter-link]: https://twitter.com/georgesg92
