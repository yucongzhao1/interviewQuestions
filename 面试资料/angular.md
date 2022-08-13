#  实现angular动画
## 启用动画模块
导入 BrowserAnimationsModule，它能把动画能力引入 Angular 应用的根模块中。
## 把动画功能导入组件文件中
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
## 添加动画的元数据属性
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  animations: [
    // animation triggers go here
  ]
})