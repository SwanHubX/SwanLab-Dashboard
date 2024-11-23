import { formatTime, getDuration } from '@swanlab-vue/utils/time.js'

// 总览页
export const getOverviewData = (exp, projectStore) => {
  return {
    experiment: parseExperimentInfo(exp, projectStore.logdir),
    system: parseSystemInfo(exp.system),
    python: parsePythonInfo(exp.system),
    git: parseGitInfo(exp.system)
  }
}

const parseExperimentInfo = (exp, logdir) => {
  if (!exp) return null
  const system = exp?.system
  return [
    { key: 'name', value: exp.name },
    { key: 'swanlab', value: system?.swanlab?.version },
    { key: 'description', value: exp.description },
    { key: 'start_time', value: formatTime(exp?.create_time) },
    { key: 'duration', value: getDuration(exp) || '' },
    { key: 'logdir', value: logdir + (logdir.includes('/') ? '/' : '\\') + exp.run_id, highLight: true, copy: true }
  ]
}

const parseSystemInfo = (system) => {
  if (!system) return null
  return [
    { key: 'hostname', value: system.hostname },
    { key: 'OS', value: system.os },
    { key: 'pid', value: system.pid }
  ]
}

const parsePythonInfo = (system) => {
  if (!system) return null
  return [
    { key: 'python', value: system.python },
    { key: 'verbose', value: system.python_verbose },
    { key: 'executable', value: system.executable, highLight: true, copy: true },
    { key: 'workspace', value: system.cwd, highLight: true, copy: true },
    { key: 'command', value: system.command, highLight: true, copy: true }
  ]
}

const parseGitInfo = (system) => {
  if (!system) return null
  return [
    { key: 'git_remote', value: system.git_remote, hightLight: true, link: true },
    { key: 'git_branch', value: system.git_info ? system.git_info[0] : '' },
    { key: 'git_commit', value: system.git_info ? system.git_info[1] : '', hightLight: true, copy: true }
  ]
}

// 硬件(除 gpu 相关)
export const getHardwareData = (exp) => {
  const system = exp?.system
  if (!system) return {}
  const gpu = exp?.system?.gpu
  return {
    cpu: parseCPUInfo(system),
    memory: parseMemoryInfo(system),
    gpu: gpu.type ? gpu : null,
    nvidia: gpu.nvidia
  }
}

const parseCPUInfo = (system) => {
  return [
    { key: 'brand', value: system.cpu?.brand },
    { key: 'cpu', value: system.cpu?.cores || system.cpu }
  ]
}

const parseMemoryInfo = (system) => {
  return [ { key: 'memory', value: system.memory ? system.memory + 'GB' : '' } ]
}
