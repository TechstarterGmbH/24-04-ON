### **Beispiel: Azure Files einrichten und mit Linux nutzen**

In diesem Beispiel zeigen wir, wie du **Azure Files** erstellst und auf einem Linux-System einbindest. Ziel ist es, ein gemeinsames Dateiverzeichnis für ein Team in der Cloud zu erstellen und es auf einem Linux-Rechner als Netzwerkfreigabe zu nutzen.

---

### **Schritte zur Einrichtung von Azure Files**

#### **1. Erstellen eines Storage Accounts**
1. Melde dich im [Azure-Portal](https://portal.azure.com/) an.
2. Suche in der Suchleiste nach **Storage Accounts** und klicke auf **+ Erstellen**.
3. Gib die folgenden Informationen ein:
   - **Abonnement**: Wähle dein Abonnement aus.
   - **Ressourcengruppe**: Wähle eine vorhandene Ressourcengruppe aus oder erstelle eine neue.
   - **Speicherkonto-Name**: Zum Beispiel `teamstorage`.
   - **Region**: Wähle eine Azure-Region (z. B. Westeuropa).
   - **Leistung**: Wähle **Standard**.
   - **Replikation**: Wähle **Lokal redundant (LRS)**.
4. Klicke auf **Überprüfen und Erstellen**, dann auf **Erstellen**, um das Speicherkonto zu erstellen.

---

#### **2. Erstellen einer File Share**
1. Öffne das erstellte Speicherkonto (`teamstorage`) im Azure-Portal.
2. Klicke im Menü links auf **Dateifreigaben** (File Shares).
3. Klicke auf **+ Dateifreigabe** (Add File Share).
4. Gib einen Namen ein, z. B. `teamfileshare`, und setze ein Quota-Limit (z. B. 100 GB).
5. Klicke auf **Erstellen**.

---

#### **3. Verbindung mit Azure File Share unter Linux**
Um die Freigabe in Linux zu verbinden, verwenden wir **SMB (Server Message Block)**, das von den meisten Linux-Distributionen unterstützt wird.

##### **Schritte:**
1. Installiere die benötigten Pakete:
   ```bash
   sudo apt update
   sudo apt install cifs-utils -y
   ```

2. Erstelle ein Verzeichnis, in dem die Azure File Share eingebunden wird:
   ```bash
   sudo mkdir /mnt/azurefiles
   ```

3. Notiere dir die Verbindungsdetails:
   - Gehe in der Dateifreigabe (`teamfileshare`) im Azure-Portal auf **Verbinden**.
   - Wähle den Tab **Linux**.
   - Dort findest du die Verbindungsskripte und Informationen wie:
     - **Serveradresse**: z. B. `//teamstorage.file.core.windows.net/teamfileshare`
     - **Benutzername**: Das Speicherkonto (`teamstorage`).
     - **Kennwort**: Den Zugriffsschlüssel des Speicherkontos (im Menü **Zugriffsschlüssel** im Speicherkonto).

4. Erstelle eine Datei für die Zugangsdaten:
   ```bash
   sudo nano /etc/smbcredentials/teamstorage.cred
   ```

   Inhalt der Datei:
   ```
   username=teamstorage
   password=DEIN_ZUGRIFFSSCHLÜSSEL
   ```
   Speichere die Datei und schließe den Editor.

5. Sichere die Datei, damit nur root darauf zugreifen kann:
   ```bash
   sudo chmod 600 /etc/smbcredentials/teamstorage.cred
   ```

6. Füge die Freigabe in die `/etc/fstab` ein, damit sie automatisch eingehängt wird:
   ```bash
   sudo nano /etc/fstab
   ```

   Füge diese Zeile hinzu:
   ```
   //teamstorage.file.core.windows.net/teamfileshare /mnt/azurefiles cifs nofail,vers=3.0,credentials=/etc/smbcredentials/teamstorage.cred,serverino
   ```

7. Binde die Freigabe ein:
   ```bash
   sudo mount -a
   ```

8. Prüfe, ob die Freigabe erfolgreich eingehängt wurde:
   ```bash
   df -h | grep azurefiles
   ```

   Du solltest die Azure-Dateifreigabe als eingebundenes Verzeichnis sehen.

---

### **4. Dateien verwenden**
- Jetzt kannst du Dateien direkt unter `/mnt/azurefiles` speichern, lesen oder bearbeiten.
- Alle Änderungen werden automatisch in der Azure-Cloud gespeichert.

---

### **Wichtige Hinweise**
- **Zugriffssteuerung**: Du kannst die Freigabe mit Azure AD oder Netzwerksicherheitsgruppen absichern.
- **Performance**: Stelle sicher, dass die SMB-Version mit `vers=3.0` angegeben ist, um optimale Sicherheit und Leistung zu gewährleisten.
- **Automatischer Neustart**: Die Einträge in `/etc/fstab` sorgen dafür, dass die Freigabe nach einem Neustart automatisch eingebunden wird.

---

Wenn du weitere Hilfe benötigst, z. B. zum Einrichten von **Azure File Sync** oder zum Einsatz von **Private Endpoints**, lass es mich wissen!
