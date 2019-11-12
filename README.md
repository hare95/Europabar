# Europabar
Gruppenprojekt: Ben, Lukas, Patrick, René

Unsere Website hat folgende Funktionen:

Europabar/Home: Normale HTML-Seite, auf welcher man am Ende ein Review zur Europabar hinterlassen kann. Je nach dem ob man eingeloggt ist, kann man eine Review anlegen und darauf antworten. Es wird angezeigt wer welche Review geschrieben hat.

Userlist: Zeigt die angelegten Benutzer an. Diese können (momentan von jedem User) gelöscht werden.

Profile: Zeigt das angemeldete Profil an. Es kann der eigene Benutzer gelöscht werden.

Login: Ein bereits angelegter User kann sich mit seinen Credentials anmelden 

Signup: Ein User kann angelegt werden. Dieser wird auf der Datenbank angelegt. Das Passwort wird verschlüsselt.

Logout: Wenn ein User angemeldet ist, kann sich dieser hiermit ausloggen und wird wieder zur Startseite navigiert.
_________________________

Wenn ein User angemeldet ist, wird er autoamtisch auf "Profile" verwiesen, wenn er auf Login oder Singup klickt.
Wenn kein User angemeldet ist, wird er automatisch auf "Login" verwiesen, wenn er auf Profile klickt.

Als Datenbank haben wir die MongoDB (mLab) verwendet.

_________________________

Mittels der ServerRoot.js wird der Server gestartet (mit dem Shortcut Alt+r). Hierfür wird das Package "atom-runner" benötigt.
