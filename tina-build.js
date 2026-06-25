const { spawn } = require('child_process');

function run() {
  console.log('Iniciando servidor local de Tina CMS en segundo plano...');
  const tina = spawn('npx', ['tinacms', 'dev'], {
    shell: true,
    stdio: ['ignore', 'pipe', 'inherit'],
    env: { ...process.env, TINA_PUBLIC_IS_LOCAL: 'true' }
  });

  let nextStarted = false;

  tina.stdout.on('data', (data) => {
    const output = data.toString();
    process.stdout.write(output);

    if (output.includes('TinaCMS Dev Server is active') && !nextStarted) {
      nextStarted = true;
      console.log('\n[Build] Servidor de Tina activo. Iniciando next build...');
      
      const next = spawn('npx', ['next', 'build'], {
        shell: true,
        stdio: 'inherit',
        env: { ...process.env, TINA_PUBLIC_IS_LOCAL: 'true' }
      });

      next.on('close', (code) => {
        console.log(`\n[Build] next build finalizó con código: ${code}`);
        tina.kill('SIGINT');
        process.exit(code);
      });
    }
  });

  tina.on('close', (code) => {
    if (!nextStarted) {
      console.error(`\n[Build] El servidor de Tina se cerró inesperadamente con código: ${code}`);
      process.exit(code || 1);
    }
  });
}

run();
