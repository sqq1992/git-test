const sh = require('shelljs');
const ora = require('ora');
if (!sh.which('git')) {
  sh.echo('Sorry, this script requires git');
  sh.exit(1);
}
const git_status_short = sh.exec(`git status -s`).toString()
if(!git_status_short) {
  const git_status = sh.exec(`git status`).toString();
  const git_status_newest = "Your branch is up-to-date with";
  const git_status_newest_two = "Your branch is up to date with";
  if(~git_status.indexOf(git_status_newest) || ~git_status.indexOf(git_status_newest_two)){
    const buildOra = ora('npm run build...').start()
    sh.exec("npm run buildMaster");
    buildOra.succeed(`Build complete!`)
    const log = sh.exec('git log -1 --pretty=format:"%s --change by %an"').toString();
    const get_branch = sh.exec('git symbolic-ref --short -q HEAD').toString()

    sh.exec("git checkout test")

    sh.exec("git pull origin test")

    sh.ls('-A').forEach(file => {
      if(!/^\.|^dist|^node_modules|^script/.test(file)){
        sh.rm('-r',file)
      }
    })

    sh.cp('-rf','./dist/*', '.')

    sh.exec("git add .")
    sh.exec(`git commit -m "${log || true}"`)
    sh.exec(`git push origin test`)
    sh.exec(`git checkout ${get_branch || "master"}`)

  }else {
    sh.echo("含有未push的commit")
  }
}else {
  sh.echo("The project has changed, please git commit.")
}
