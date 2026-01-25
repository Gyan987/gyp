# 🏃 Temple Run - Endless Runner Game

A web-based endless runner game inspired by Temple Run, built with HTML5 Canvas and vanilla JavaScript.

## 🎮 Game Features

### Core Gameplay
- **3-Lane System**: Switch between left, center, and right lanes to avoid obstacles
- **Dynamic Obstacles**: 
  - Red barriers that must be jumped over
  - Yellow low obstacles that must be slid under
- **Coin Collection**: Golden coins appear at different heights (ground, mid, high)
- **Progressive Difficulty**: Game speed increases as you play longer
- **Score System**: Earn points by:
  - Running distance (continuous scoring)
  - Passing obstacles (10 points each)
  - Collecting coins (5 points each)

## 🎯 How to Play

### Controls

#### Desktop/Keyboard
- **⬅️ Arrow Left**: Move to left lane
- **➡️ Arrow Right**: Move to right lane  
- **⬆️ Arrow Up**: Jump over obstacles
- **⬇️ Arrow Down**: Slide under low obstacles

#### Mobile/Touch
- **On-screen buttons**: Use the directional buttons at the bottom
- **Swipe gestures**:
  - Swipe left/right: Change lanes
  - Swipe up: Jump
  - Swipe down: Slide

## 🚀 Getting Started

### Play Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Gyan987/gyp.git
   cd gyp
   ```

2. **Open in browser**:
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     python3 -m http.server 8080
     # Then visit http://localhost:8080
     ```

3. **Start playing**:
   - Click "Start Game" to begin
   - Use controls to avoid obstacles and collect coins
   - Try to beat your high score!

## 📁 Project Structure

```
gyp/
├── index.html      # Main HTML structure
├── style.css       # Game styling and UI
├── game.js         # Game logic and mechanics
├── contract/       # Original blockchain contract
└── README.md       # This file
```

## 🎨 Game Elements

### Player Character
- Blue running character
- Smooth jump animations with parabolic trajectory
- Sliding animation for low obstacles
- Animated running legs

### Obstacles
- **Red Barriers**: Tall obstacles requiring jumps
- **Yellow Low Obstacles**: Must slide to pass safely

### Collectibles
- **Golden Coins**: Appear at various heights
  - Ground level: Easy to collect while running
  - Mid-air: Collect while jumping
  - High: Requires perfect jump timing

### Environment
- 3D perspective rendering
- Lane markings with dashed lines
- Gradient backgrounds
- Real-time score display

## 🛠️ Technical Details

### Technologies Used
- **HTML5 Canvas** - For rendering game graphics
- **Vanilla JavaScript** - Game logic and mechanics
- **CSS3** - UI styling and animations
- **No external frameworks** - Pure web technologies

### Game Loop
- Uses `requestAnimationFrame` for smooth 60 FPS gameplay
- Collision detection with proper hitbox calculations
- Object pooling for obstacles and coins
- Progressive difficulty scaling

### Code Structure
- Object-oriented design with ES6 classes
- Separate classes for `Obstacle` and `Coin` entities
- Centralized game state management
- Modular and maintainable code

## 🎯 Tips for High Scores

1. **Stay Centered**: The middle lane gives you more options
2. **Plan Ahead**: Look for obstacles early
3. **Collect Coins**: They boost your score significantly
4. **Perfect Timing**: Jump and slide at the right moment
5. **Stay Focused**: Speed increases over time!

## 📱 Responsive Design

The game works on:
- Desktop computers (optimal experience)
- Tablets (touch controls)
- Mobile phones (swipe gestures)

## 🎓 Learning Resource

This project demonstrates:
- HTML5 Canvas API usage
- Game loop implementation
- Collision detection algorithms
- Object-oriented JavaScript
- Responsive design principles
- Game state management

## 📄 License

MIT License - Feel free to use and modify!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 🎮 Future Enhancements

Potential improvements:
- Power-ups (shield, magnet, boost)
- Different environments/themes
- Multiplayer mode
- Leaderboard system
- Sound effects and music
- More obstacle types
- Achievement system

## 📞 Contact

Created by Gyan987 - Feel free to reach out!

---

**Enjoy the game and try to beat your high score! 🏆**
