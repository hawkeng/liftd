#!/usr/bin/env node

const { spawn } = require("child_process");
const inquirer = require("inquirer");

const argv = process.argv.slice(2);

if (!argv.length) {
  console.log(`
    Usage:

    liftd <path to project root>

    Where project root is a path to a directory containing a package.json
  `);
  return;
}

if (require.main === module) {
  const [projectRoot] = argv;
  getDependencies(projectRoot)
    .then(promptDependenciesToUpdate)
    .then(({ dependencies }) =>
      updateSelectedDependencies(dependencies, projectRoot)
    )
    .catch(console.error);
}

async function getDependencies(projectRoot) {
  const output = await runCommand("yarn", [
    "outdated",
    "--json",
    "--cwd",
    projectRoot,
  ]);

  // NOTE: yarn outdated exits with non-zero code when it found outdated dependencies
  return formatOutput(output);
}

function runCommand(cmd, args, opts) {
  return new Promise((resolve, reject) => {
    const ps = spawn(cmd, args, opts);

    let stdout = "";
    ps.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    ps.stderr.on("data", (data) => {
      console.warn(data.toString());
    });

    ps.on("error", reject);

    ps.on("close", () => {
      resolve(stdout);
    });
  });
}

function formatOutput(output) {
  const [_, table] = output.split("\n");
  return JSON.parse(table).data.body.map((dependency) => {
    const [package, currentVersion, wantedVersion, latestVersion] = dependency;
    return { package, currentVersion, wantedVersion, latestVersion };
  });
}

function promptDependenciesToUpdate(dependencies) {
  const choices = dependencies.flatMap(
    ({ package, currentVersion, wantedVersion, latestVersion }) => {
      return [
        {
          name: `${package} ${currentVersion} -> ${wantedVersion} (wanted version)`,
          value: `${package}@${wantedVersion}`,
        },
        {
          name: `${package} ${currentVersion} -> ${latestVersion} (latest version)`,
          value: `${package}@${latestVersion}`,
        },
        new inquirer.Separator(),
      ];
    }
  );
  return inquirer.prompt([
    {
      type: "checkbox",
      choices,
      name: "dependencies",
      message: "Select dependencies you wish to update",
      pageSize: 16,
    },
  ]);
}

async function updateSelectedDependencies(packages, projectRoot) {
  console.log(`yarn upgrade ${packages.join(" ")}`);

  const output = await runCommand("yarn", ["upgrade", ...packages], {
    cwd: projectRoot,
  });
  console.log(output);
}
