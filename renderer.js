const drop = document.getElementById('drop');
const list = document.getElementById('list');

let files = [];

// ✅ 关键：必须阻止默认行为
window.addEventListener('dragover', e => e.preventDefault());
window.addEventListener('drop', e => e.preventDefault());

drop.addEventListener('drop', async (e) => {
  e.preventDefault();

  for (let file of e.dataTransfer.files) {
    const path = file.path;

    const time = await window.api.getTime(path);
    const currentTime = new Date(time).toLocaleString();

    files.push({
      path,
      currentTime,
      aiTime: guessTime(file.name)
    });
  }

  render();
});

function guessTime(name) {
  const match = name.match(/(20\d{6})/);
  if (match) {
    const str = match[1];
    return `${str.slice(0,4)}-${str.slice(4,6)}-${str.slice(6,8)} 12:00`;
  }
  return "未知";
}

function render() {
  list.innerHTML = '';

  files.forEach(f => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${f.path.split('\\').pop()}</td>
      <td>${f.currentTime}</td>
      <td>${f.aiTime}</td>
    `;

    tr.onclick = async () => {
      const input = prompt("输入新时间（例如：2024-03-12 12:00）");

      if (input) {
        await window.api.setTime(f.path, input);
        alert("修改成功！");
      }
    };

    list.appendChild(tr);
  });
}

document.getElementById('fixAll').onclick = async () => {
  for (let f of files) {
    if (f.aiTime !== "未知") {
      await window.api.setTime(f.path, f.aiTime);
    }
  }
  alert("完成！");
};
