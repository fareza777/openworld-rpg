// The game's static build for the Android shell (docs/sunshard/ANDROID.md): the world generated, then the client built
// without the online-model plugin (VITE_NO_AI=1: the game plays fully offline), into the webDir Capacitor copies.
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const run = (cmd, cwd, env = {}) => execSync(cmd, { cwd, stdio: 'inherit', env: { ...process.env, ...env } })

run('npm run gen:world', root)
run('npx vite build', join(root, 'games/openworld/client'), { VITE_NO_AI: '1' })
