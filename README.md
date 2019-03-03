# Droidcon Boston iOS

## Development Setup

- `yarn`
- `react-native link`
- `cd ./ios && pod repo update && pod install`
- Follow Firebase setup instructions and place GoogleService-Info.plist in /ios directory of project. Make sure this file is included under Build Phases -> Copy Bundle Resources.
  - Check the `DATABASE_URL` in GoogleService-Info.plist. It will contain the default project database. Change if needed.
- Use prettier for formatting
  - https://prettier.io/

## Screenshots

![Agenda](https://github.com/Droidcon-Boston/conference-app-ios/blob/master/fastlane/screenshots/agenda_iphonex_framed.png "Agenda")

![Session](https://github.com/Droidcon-Boston/conference-app-ios/blob/master/fastlane/screenshots/session_iphonex_framed.png "Session")

![Speakers](https://github.com/Droidcon-Boston/conference-app-ios/blob/master/fastlane/screenshots/speakers_iphonex_framed.png "Speakers")
