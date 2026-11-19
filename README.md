# enesisaoglu.github.io

Personal site of Enes Isaoglu, robotics engineer. Live at https://enesisaoglu.github.io

A small static site generator in Python (`build.py`, Jinja2 + Markdown).
Every push to `main` builds the site and deploys it to GitHub Pages through
GitHub Actions (`.github/workflows/deploy.yml`).

```
site.yml               name, links, intro text, Google verification
content/skills.yml     skills shown on the interactive robot
content/experience.yml
content/projects.yml
content/papers.yml
content/posts/*.md     blog posts (files starting with _ are ignored)
static/                css, js, fonts, images, CV
templates/             page layouts and the robot drawing
```

Run locally:

```
pip install -r requirements.txt
python build.py
python -m http.server 8000 --directory dist
```
