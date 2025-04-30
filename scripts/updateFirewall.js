const path = require("path");
const axios = require("axios");
const fs = require("fs");
require('dotenv').config();


const FIREWALL_ID = process.env.FIREWALL_ID;
const DO_API_TOKEN = process.env.DO_API_TOKEN;
const FIREWALL_PORT = process.env.FIREWALL_PORT;
const LAST_IP_PATH = path.join(__dirname, "../last_ip.json");

const getCurrentIp = async () => {
  const res = await axios.get("https://api.ipify.org");
  return res.data.trim();
};

const getFirewall = async () => {
  try {
    const res = await axios.get(`https://api.digitalocean.com/v2/firewalls/${FIREWALL_ID}`, {
      headers: {
        Authorization: `Bearer ${DO_API_TOKEN}`,
      },
    });
    console.log("📦 Получен фаервол:");
    console.dir(res.data.firewall, { depth: null });
    return res.data.firewall;
  } catch (err) {
    console.error("❌ Ошибка при получении фаервола:", err.response?.data || err.message);
    throw err;
  }
};

const updateFirewall = async (currentIp, oldIp) => {
  const firewall = await getFirewall();

  const newInboundRules = firewall.inbound_rules.filter(
    rule => !(rule.sources?.addresses?.includes(`${oldIp}/32`))
  );

  newInboundRules.push({
    protocol: "tcp",
    ports: FIREWALL_PORT,
    sources: {
      addresses: [`${currentIp}/32`],
    },
  });

  const updatedData = {
    name: firewall.name,
    inbound_rules: newInboundRules,
    outbound_rules: firewall.outbound_rules,
    droplet_ids: firewall.droplet_ids,
    tags: firewall.tags,
  };

  console.log("📤 Отправляем обновлённые правила:");
  console.dir(updatedData, { depth: null });

  await axios.put(
    `https://api.digitalocean.com/v2/firewalls/${FIREWALL_ID}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${DO_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  fs.writeFileSync(LAST_IP_PATH, JSON.stringify({ ip: currentIp }, null, 2));
  console.log(`[✔️] IP успешно обновлён в firewall: ${currentIp}`);
};

const main = async () => {
  const currentIp = await getCurrentIp();
  let oldIp = "";

  if (fs.existsSync(LAST_IP_PATH)) {
    oldIp = JSON.parse(fs.readFileSync(LAST_IP_PATH)).ip;
  }

  if (currentIp !== oldIp) {
    console.log(`IP изменился: ${oldIp || "(первый запуск)"} → ${currentIp}`);
    await updateFirewall(currentIp, oldIp);
  } else {
    console.log("IP не изменился.");
  }
};

main().catch(err => {
  console.error("❌ Ошибка:", err.response?.data || err.message);
});