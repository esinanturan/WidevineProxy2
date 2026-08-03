# WidevineProxy2
An extension-based proxy for Widevine/ClearKey EME challenges and license messages. \
Modifies the challenge before it reaches the web player and retrieves the decryption keys from the response.

## Features
+ User-friendly / GUI-based
+ Bypasses one-time tokens, hashes, and license wrapping
+ JavaScript native Widevine implementation
+ Supports Widevine Device files and remote CDMs
+ Key history and DRM status display
+ Manifest V3 compliant

## Prerequisites
This addon requires a Widevine device to work, either locally or remotely:
+ Use an existing Remote CDM
+ Follow [this](https://forum.videohelp.com/threads/408031) guide if you want to dump your own device.
+ Ready-to-use Widevine Devices can be found on the [VideoHelp forum](https://forum.videohelp.com/forums/48).

## Installation
+ Chrome
    1. Download the ZIP file from the [releases section](https://github.com/DevLARLEY/WidevineProxy2/releases)
    2. Navigate to `chrome://extensions/`
    3. Enable `Developer mode`
    4. Drag-and-drop the downloaded file into the window
+ Firefox
    + Persistent installation
        1. Download the XPI file from the [releases section](https://github.com/DevLARLEY/WidevineProxy2/releases)
        2. Navigate to `about:addons`
        3. Click the settings icon and choose `Install Add-on From File...`
        4. Select the downloaded file
    + Temporary installation
        1. Download the ZIP file from the [releases section](https://github.com/DevLARLEY/WidevineProxy2/releases)
        2. Navigate to `about:debugging#/runtime/this-firefox`
        3. Click `Load Temporary Add-on...` and select the downloaded file

### Setup
Select your device type in the popup window and follow the steps for either type below

#### Local Widevine device
If you only have a `device_client_id_blob` and `device_private_key`, run this command to create a .wvd file:
```
pywidevine create-device -k device_private_key -c device_client_id_blob -t "ANDROID" -l 3
```
Open the dropdown and click `+ Choose File`, in the window that opens, click `Choose File` again and select the created `.wvd` file.

#### Remote Widevine CDM
Open the dropdown and click `+ Choose File`, in the window that opens, click `Choose File` again and select the supplied `remote.json` file.

## Usage
Once you've at least installed one Widevine device, play a video on a page that you think uses Widevine DRM and the keys should in the `Keys` section. \
This section only shows the most recent keys (past 5 min.), to see all keys, click `History` on the right to open the history page. 

### DRM status display
| Name        | Activated by                                                             |
|-------------|--------------------------------------------------------------------------|
| `MediaKeys` | `MediaKeySystemAccess.createMediaKeys()` called                          |
| `Session`   | `MediaKeys.createSession()` called                                       |
| `Generated` | `MediaKeySession.generateRequest()` called                               |
| `Challenge` | `MediaKeyMessageEvent` occurred with `.message.byteLength > 2`           |
| `License`   | `MediaKeySession.update()` called with `SignedMessage` of type `LICENSE` |

### Issue debug table
The table below does not cover 100% of cases but is accurate enough.

| Keys appear | Video plays | DRM status                                                                                                                  | Possible cause                        | Possible fix                                                  |
|-------------|-------------|-----------------------------------------------------------------------------------------------------------------------------|---------------------------------------|---------------------------------------------------------------|
| No          | Yes         | ![](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `Challenge` / ![](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `License` | The page does not use DRM             |                                                               |
| No          | Yes         | ![](https://placehold.co/15x15/3D8B3D/3D8B3D.png) `Challenge` / ![](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `License` | Unable to intercept messages          | Try using proxy mode `property`, <br> otherwise open an issue |
| No          | No          | ![](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `Challenge` / ![](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `License` | Unknown, likely unrelated to addon    |                                                               |
| No          | No          | ![](https://placehold.co/15x15/3D8B3D/3D8B3D.png) `Challenge` / ![](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `License` | Endpoint does not accept Android CDMs | (see below)                                                   |

If the license endpoint has been configured to only accept Android CDMs, you need to either:
+ Try using WidevineProxy2 on an Android device
+ Use a Chrome remote CDM

## Demo (of pre v1)
[Widevineproxy2.webm](https://github.com/user-attachments/assets/8f51cee3-50e2-4aa4-b244-afa2d0b2987e)

## Building

### Bundle
If you just want to run this addon locally with changes applied, run `npm run bundle`. \
Now select the `src` directory (or a file there within) to install the addon temporarily. 

### Package
Create the following `.env` file with [Mozilla addon dev credentials](https://addons.mozilla.org/en-US/developers/addon/api/key/) in the root directory:
```
API_KEY=...
API_SECRET=...
```

To package the previously created bundles into a single .zip/.xpi file, run `npm run package`. To target only a specific browser, specify the type like this: `npm run package -- <chrome/firefox/both>`. Supplying no arguments targets both. \
This requires the bundles to be present, so it must not be run on its own.

### Publish
Running `npm run publish` will execute both `bundle` and `package`.

## Disclaimer
+ This program is intended solely for educational purposes.
+ Do not use this program to decrypt or access any content for which you do not have the legal rights or explicit permission.
+ Unauthorized decryption or distribution of copyrighted materials is a violation of applicable laws and intellectual property rights.
+ This tool must not be used for any illegal activities, including but not limited to piracy, circumventing digital rights management (DRM), or unauthorized access to protected content.
+ The developers, contributors, and maintainers of this program are not responsible for any misuse or illegal activities performed using this software.
+ By using this program, you agree to comply with all applicable laws and regulations governing digital rights and copyright protections.

## Credits
+ [node-widevine](https://github.com/Frooastside/node-widevine)
+ [forge](https://github.com/digitalbazaar/forge)
+ [protobuf.js](https://github.com/protobufjs/protobuf.js)