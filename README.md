# blendoku

### 簡介
參考自同名手機遊戲，由選擇名單中排列出正確的色彩漸層。

### 連結
- Github: https://github.com/yogafox/midterm_blendoku

### 使用說明
- Build
1. Clone Repo
3. 在 midterm_blendoku/ 中執行 npm install
4. 在 midterm_blendoku/frontend 中執行 npm install
5. 在 midterm_blendoku/backend 中執行 npm install
4. 在 midterm_blendoku/ 中執行 npm start

- Feature & Todo
- [x] 初始畫面中點擊 New Game 可開始新遊戲
- [x] 遊戲畫面中間兩排，上方是選擇區、下方是排列區，透過選擇任兩個元素進行交換，請在排列區中參考已知元素排列出漸層的排列
- [x] 遊戲畫面左上角 Exit 可回到初始畫面
- [x] 遊戲畫面左下角 Save/Load 可透過指定 Name 存取遊戲記錄（初始畫面的 Load 也可以）
- [ ] 遊戲畫面右上角 Ans 可存取解答（未完成功能）
- [ ] 遊戲畫面右下角 Prev 可回到上一步 （未完成功能）
- [ ] 遊戲畫面右下角 Hint 可增加一個已知元素 （未完成功能）

### 使用的框架
- 前端
    - React
- 後端
    - Express, node.js, mongoDB as database

### 貢獻
- 前端
    - 全部由自己寫出來
- 後端
    - 參考自https://medium.com/javascript-in-plain-english/full-stack-mongodb-react-node-js-express-js-in-one-simple-app-6cc8ed6de274
    - 資料流由我自己設計

### 心得
　　這次的作業中我花在前端功能設計上的時間遠多於寫前端排版以及後端資料流的時間，雖然在動工之前有進行過架構設計，但在過程中還是有進行幾次重構，因此耽誤到了繳交時間，這部分之後可以再改進。
　　
### 未來發展
　　之後除了補完上面提到的未完成功能外，還希望可以增加題目的多樣性。