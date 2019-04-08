# Droidcon Boston iOS

## Development Setup

- `yarn`
- `react-native link`
- `cd ./ios && pod repo update && pod install`
- Follow Firebase setup instructions and place GoogleService-Info.plist in /ios directory of project. Make sure this file is included under Build Phases -> Copy Bundle Resources.
  - Check the `DATABASE_URL` in GoogleService-Info.plist. It will contain the default project database. Change if needed.
- Use prettier for formatting
  - https://prettier.io/
