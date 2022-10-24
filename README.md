# Pillars ✨

Pillars gives you the ability to move your cursor based on the columns identified in the lines above. Which makes aligning codes much easier if you the formatter doesn't support it.

![](https://user-images.githubusercontent.com/2157285/197598810-1ef1bef4-dc76-4cab-a9fb-6c45a55cf96c.gif)

## But Why?

The tool let's you write this things easily.

```ts
import * as vscode      from 'vscode';
import * as engine      from '../../engine';
import * as tools       from '../tools';
import * as services    from '../services';
import * as parameters  from '../parameters';
import * as languages   from '../languages';
```

```dart
const _pageBackgroundColor        = Color(0xFF141414);
const _centeredBoxBackgroundColor = Color(0xFF323232);
const _minimumAllAroundPadding    = 50.0;
const _miniPageContainerWidth     = 360.0;
const _miniPagePadding            = 30.0;
```

## But How?

### macOS
- Move Left: `option`+`command`+`left`
- Move Right: `option`+`command`+`right`

### Linux and Windows
- Move Left: `alt`+`windows`+`left`
- Move Right: `alt`+`windows`+`right`