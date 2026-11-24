<div dir="rtl">

# מדריך: איך מוסיפים שינוי לפרויקט דרך Pull Request

המדריך הזה מלווה אתכם צעד אחר צעד בתהליך שבו עובדים בצוותי פיתוח אמיתיים: מכניסים שינוי לקוד, שומרים אותו ב-Git, ומבקשים לצרף אותו לפרויקט דרך **Pull Request** ב-GitHub.

לאורך המדריך נשתמש בדוגמה אמיתית מהפרויקט: הוספת דף `hello` שמחזיר את המילה hello ואת שם המשתמש.

> לא צריך ידע קודם ב-Git. כל מושג מוסבר כשהוא מופיע לראשונה.

---

## תוכן עניינים

1. [מושגי יסוד](#מושגי-יסוד)
2. [הכנה חד-פעמית](#הכנה-חד-פעמית)
3. [התהליך המלא בקצרה](#התהליך-המלא-בקצרה)
4. [שלב 1: מתחילים מ-main מעודכן](#שלב-1-מתחילים-מ-main-מעודכן)
5. [שלב 2: יוצרים branch חדש](#שלב-2-יוצרים-branch-חדש)
6. [שלב 3: כותבים את הקוד ובודקים שהוא עובד](#שלב-3-כותבים-את-הקוד-ובודקים-שהוא-עובד)
7. [שלב 4: בודקים מה השתנה](#שלב-4-בודקים-מה-השתנה)
8. [שלב 5: שומרים את השינויים ב-commit](#שלב-5-שומרים-את-השינויים-ב-commit)
9. [שלב 6: מעלים את ה-branch ל-GitHub (push)](#שלב-6-מעלים-את-ה-branch-ל-github-push)
10. [שלב 7: יוצרים Pull Request](#שלב-7-יוצרים-pull-request)
11. [שלב 8: Merge, כלומר מיזוג ה-PR](#שלב-8-merge-כלומר-מיזוג-ה-pr)
12. [שלב 9: מעדכנים את המחשב שלכם](#שלב-9-מעדכנים-את-המחשב-שלכם)
13. [שלב 10: מוחקים את ה-branch](#שלב-10-מוחקים-את-ה-branch)
14. [תקלות נפוצות ופתרונות](#תקלות-נפוצות-ופתרונות)
15. [דף עזר מהיר](#דף-עזר-מהיר)

---

## מושגי יסוד

| מושג | מה זה | דימוי |
|------|-------|-------|
| **Repository (מאגר)** | התיקייה של הפרויקט, יחד עם כל ההיסטוריה של השינויים בה. | ספר יחד עם כל הטיוטות שלו. |
| **Commit** | "צילום מצב" של הקוד בנקודת זמן, עם הודעה שמתארת מה השתנה. | שמירת משחק עם תיאור. |
| **Branch (ענף)** | קו פיתוח נפרד שבו אפשר לעבוד בלי להשפיע על הקוד הראשי. | עותק טיוטה שעובדים עליו בצד. |
| **main** | ה-branch הראשי. הקוד שבו נחשב לגרסה "הרשמית" של הפרויקט. | הספר המודפס. |
| **Local / Remote** | Local הוא העותק שבמחשב שלכם. Remote (בשם `origin`) הוא העותק שב-GitHub. | המחברת שלכם מול הלוח בכיתה. |
| **Push** | העלאת commits מהמחשב שלכם ל-GitHub. | |
| **Pull** | הורדת שינויים מ-GitHub למחשב שלכם. | |
| **Pull Request (PR)** | בקשה לצרף את השינויים מ-branch מסוים ל-`main`. חברי הצוות יכולים לראות את השינויים, להגיב ולאשר. | הגשת עבודה לבדיקה לפני שהיא נכנסת לספר. |
| **Merge (מיזוג)** | צירוף השינויים מ-branch אחד לתוך branch אחר. | |

### למה לא עובדים ישר על main?

- **`main` נשאר תמיד תקין.** אם משהו נשבר, זה קורה רק ב-branch שלכם.
- **מישהו אחר יכול לבדוק** את הקוד לפני שהוא נכנס לפרויקט.
- **כמה אנשים יכולים לעבוד במקביל**, כל אחד ב-branch משלו, בלי להפריע אחד לשני.
- **ההיסטוריה ברורה.** לכל שינוי יש PR שמסביר מה נעשה ולמה.

---

## הכנה חד-פעמית

### 1. להתקין Git

אם `git --version` בטרמינל מחזיר מספר גרסה, Git כבר מותקן. אם לא, מורידים ומתקינים מ-https://git-scm.com.

### 2. להגדיר שם ומייל

השם והמייל יופיעו על כל commit שתעשו:

```powershell
git config --global user.name "השם שלכם"
```
```powershell
git config --global user.email "המייל שלכם ב-GitHub"
```

### 3. (מומלץ) להתקין את GitHub CLI

GitHub CLI היא תוכנה בשם `gh` שמאפשרת ליצור PR מהטרמינל. היא לא חובה, כי אפשר לעשות הכל גם דרך האתר.

```powershell
winget install GitHub.cli
```

אחרי ההתקנה **סוגרים את הטרמינל ופותחים חדש**, ואז מתחברים:

```powershell
gh auth login
```

בשאלות שיופיעו בוחרים:

| שאלה | תשובה |
|------|-------|
| Where do you use GitHub? | **GitHub.com** |
| How would you like to authenticate? | **Login with a web browser** |
| What is your preferred protocol? | **HTTPS** |
| Authenticate Git with your GitHub credentials? | **Y** (פשוט Enter) |

**מה פירוש השאלה האחרונה?** עונים Y כדי ש-`git push` ו-`git pull` ישתמשו באותה התחברות של `gh`, בלי לבקש סיסמה. זה הכי פשוט.

בסוף יופיע קוד בן 8 תווים. לוחצים Enter, הדפדפן נפתח, מדביקים בו את הקוד ומאשרים.

---

## התהליך המלא בקצרה

```
main מעודכן  →  branch חדש  →  כותבים קוד  →  commit  →  push  →  Pull Request  →  merge  →  מעדכנים את main המקומי  →  מוחקים את ה-branch
```

כל פיצ'ר חדש עובר את המעגל הזה מההתחלה.

---

## שלב 1: מתחילים מ-main מעודכן

לפני שמתחילים לעבוד, מוודאים שיש לכם את הגרסה האחרונה של הקוד:

```powershell
git checkout main
```
```powershell
git pull
```

- `git checkout main` עובר ל-branch הראשי.
- `git pull` מוריד את כל השינויים שחברי הצוות כבר הכניסו.

---

## שלב 2: יוצרים branch חדש

```powershell
git checkout -b feature/hello-page
```

`-b` אומר: "צור branch חדש ועבור אליו".

**איך בוחרים שם?** שם קצר באנגלית, בלי רווחים, שמתאר את השינוי. נהוג להוסיף קידומת לפי סוג השינוי:

| קידומת | מתי | דוגמה |
|--------|-----|-------|
| `feature/` | פיצ'ר חדש | `feature/hello-page` |
| `fix/` | תיקון באג | `fix/login-error` |
| `docs/` | תיעוד | `docs/pr-guide` |

כדי לבדוק באיזה branch אתם נמצאים:

```powershell
git branch
```

ה-branch הנוכחי מסומן ב-`*`.

---

## שלב 3: כותבים את הקוד ובודקים שהוא עובד

עכשיו עובדים כרגיל: עורכים קבצים, מריצים ובודקים. בדוגמה שלנו הוספנו שני דברים.

**בשרת** ([server/main.py](../../server/main.py)), נקודת קצה חדשה:

```python
@app.get("/api/hello/{name}")
def hello(name: str):
    return {"message": "hello", "name": name}
```

**בלקוח** (React), דף חדש `Hello.js` וניתוב לכתובת `/hello` בעזרת הספרייה `react-router-dom`.

### בודקים לפני שממשיכים!

**לעולם לא מגישים PR עם קוד שלא בדקתם.** בדוגמה שלנו:

- פתחנו בדפדפן http://localhost:8000/api/hello/yair וקיבלנו `{"message":"hello","name":"yair"}`.
- התחברנו לאתר, לחצנו על "לדף hello" וראינו את ההודעה.

---

## שלב 4: בודקים מה השתנה

```powershell
git status
```

הפקודה מציגה את הקבצים שהשתנו. לתצוגה מקוצרת וקריאה יותר אפשר להוסיף `-s`:

```powershell
git status -s
```

לדוגמה:

```
 M client/package.json      ← קובץ קיים ששונה (Modified)
 M client/src/App.js
 M server/main.py
?? client/src/Hello.js      ← קובץ חדש ש-Git עוד לא מכיר (Untracked)
```

כדי לראות בדיוק אילו שורות השתנו:

```powershell
git diff
```

(יוצאים מהתצוגה עם המקש `q`.)

**למה זה חשוב?** כדי לוודא שלא נכנסים ל-commit קבצים שלא התכוונתם להוסיף. לדוגמה: קבצי ניסיון, או קובץ `.env` עם סיסמאות. **קובץ `.env` אסור להעלות ל-GitHub!**

---

## שלב 5: שומרים את השינויים ב-commit

### 5.1 בוחרים אילו קבצים ייכנסו (add)

```powershell
git add client/package.json client/src/App.js client/src/index.js client/src/Hello.js server/main.py
```

אפשר גם `git add .` כדי להוסיף את כל הקבצים, אבל רק אחרי שבדקתם ב-`git status` שאין שם משהו מיותר.

### 5.2 יוצרים את ה-commit

```powershell
git commit -m "Add hello endpoint and /hello page"
```

**הודעת commit טובה** מתארת **מה** השינוי עושה, בקצרה ובלשון ציווי:

| ✅ טוב | ❌ לא טוב |
|-------|----------|
| `Add hello endpoint and /hello page` | `changes` |
| `Fix login error when email is empty` | `asdf` |
| `Update README with setup steps` | `final version 2` |

כדי לראות את ה-commits האחרונים:

```powershell
git log --oneline -3
```

---

## שלב 6: מעלים את ה-branch ל-GitHub (push)

```powershell
git push -u origin feature/hello-page
```

- `origin` הוא השם של המאגר ב-GitHub.
- `-u` "מקשר" את ה-branch המקומי ל-branch ב-GitHub. בפעמים הבאות מספיק לכתוב `git push`.

בסוף הפלט GitHub מציע קישור ליצירת PR:

```
remote: Create a pull request for 'feature/hello-page' on GitHub by visiting:
remote:      https://github.com/<user>/<repo>/pull/new/feature/hello-page
```

---

## שלב 7: יוצרים Pull Request

אפשר ליצור את ה-PR בשתי דרכים.

### דרך א': באתר GitHub

1. פותחים את הקישור שהופיע אחרי ה-push, או נכנסים למאגר ב-GitHub ולוחצים על הכפתור הצהוב **Compare & pull request**.
2. בודקים שבראש הדף כתוב **base: `main`** ← **compare: `feature/hello-page`**. כלומר: לצרף את ה-branch שלי לתוך main.
3. ממלאים **כותרת** ו**תיאור** (ראו בהמשך מה כותבים).
4. לוחצים על **Create pull request**.

### דרך ב': מהטרמינל (עם gh)

```powershell
gh pr create --base main --title "Add hello endpoint and /hello page" --body "תיאור השינוי"
```

אם מריצים רק `gh pr create`, הכלי ישאל על כל פרט בנפרד.

### מה כותבים בתיאור ה-PR?

תיאור טוב עונה על שתי שאלות: **מה שיניתי** ו**איך בדקתי**. לדוגמה:

```markdown
## מה השתנה
- שרת: נקודת קצה `GET /api/hello/{name}` שמחזירה `{"message": "hello", "name": name}`
- לקוח: נוספה הספרייה `react-router-dom` וניתוב לדפים `/` ו-`/hello`
- לקוח: דף Hello חדש שמציג את ההודעה למשתמש המחובר

## איך בדקתי
- [x] `GET /api/hello/yair` מחזיר 200 עם ה-JSON הנכון
- [x] אחרי התחברות, הדף /hello מציג `hello, <email>`
- [x] כניסה ל-/hello בלי התחברות מציגה "צריך להתחבר קודם"
```

### מה רואים בדף ה-PR?

- **Conversation:** התיאור ותגובות של חברי הצוות.
- **Commits:** רשימת ה-commits ב-PR.
- **Files changed:** כל השינויים, שורה אחר שורה. כאן חברי הצוות עושים Code Review.
- **Checks:** בדיקות אוטומטיות (CI), אם הוגדרו כאלה במאגר.

**רוצים לתקן משהו אחרי שה-PR כבר נפתח?** פשוט עושים עוד commit ו-push לאותו branch, וה-PR מתעדכן לבד. לא צריך לפתוח PR חדש.

---

## שלב 8: Merge, כלומר מיזוג ה-PR

אחרי שה-PR נבדק ואושר, לוחצים בדף ה-PR על **Merge pull request** ואז על **Confirm merge**.

עכשיו השינויים נמצאים ב-`main` **ב-GitHub**. במחשב שלכם עדיין אין אותם, וזה השלב הבא.

> **טיפ:** מיד אחרי ה-merge מופיע הכפתור **Delete branch**. אפשר ללחוץ עליו כבר עכשיו, וזה חוסך חלק משלב 10.

---

## שלב 9: מעדכנים את המחשב שלכם

```powershell
git checkout main
```
```powershell
git pull
```

כדי לוודא שהעדכון הצליח:

```powershell
git log --oneline -3
```

בראש הרשימה אמורה להופיע שורה כמו:

```
29dea5b Merge pull request #1 from <user>/feature/hello-page
```

---

## שלב 10: מוחקים את ה-branch

### למה מוחקים?

ה-branch סיים את התפקיד שלו. **מחיקה שלו לא מוחקת שום קוד.** branch הוא רק "פתק" שמצביע על commit, וה-commits עצמם כבר נמצאים ב-`main` אחרי ה-merge.

אם משאירים branches ישנים, שום דבר לא נשבר, אבל:

- הם **מצטברים** ויוצרים בלגן. אחרי חודש כבר לא ברור מה עוד בעבודה ומה כבר מוזג.
- חבר צוות עלול לחשוב שמישהו **עדיין עובד** עליהם.
- הם **לא מתעדכנים**. מי שימשיך לעבוד עליהם יעבוד על קוד ישן ויקבל קונפליקטים.

**הנוהג המקובל:** branch חי רק עד שה-PR שלו מוזג.

### מחיקת ה-branch המקומי

```powershell
git branch -d feature/hello-page
```

`-d` מוחק רק אם כל השינויים כבר מוזגו, ולכן זה בטוח.

### מחיקת ה-branch ב-GitHub

אם לא לחצתם על **Delete branch** בדף ה-PR, אפשר למחוק מהטרמינל:

```powershell
git push origin --delete feature/hello-page
```

### ניקוי הפניות ישנות

```powershell
git fetch --prune
```

הפקודה מסירה מהמחשב הפניות (כמו `origin/feature/hello-page`) ל-branches שכבר נמחקו ב-GitHub.

כדי לבדוק שהכל נקי:

```powershell
git branch -a
```

אמורים לראות רק את `main` ואת `remotes/origin/main`.

> **טיפ למאגר:** ב-GitHub, תחת Settings ← General ← Pull Requests, אפשר לסמן **Automatically delete head branches**. אז ה-branch ב-GitHub נמחק לבד אחרי כל merge.

---

## תקלות נפוצות ופתרונות

את כל התקלות האלה פגשנו בפועל בזמן שעבדנו על הדוגמה.

### `warning: LF will be replaced by CRLF`

**מה זה:** Windows ו-Linux מסמנים סוף שורה בצורה שונה, ו-Git מודיע שהוא ימיר ביניהן.

**מה עושים:** כלום. זו רק אזהרה ולא שגיאה.

---

### `gh : The term 'gh' is not recognized...`

**מה זה:** התקנתם את `gh`, אבל הטרמינל נפתח **לפני** ההתקנה. טרמינל קורא את רשימת התוכנות (PATH) רק כשהוא נפתח.

**מה עושים:** סוגרים את הטרמינל ופותחים חדש. אם זה הטרמינל המובנה של VS Code, סוגרים ופותחים מחדש את VS Code כולו.

---

### `Deletion of directory '.git/logs/refs/heads/feature' failed. Should I try again? (y/n)`

**מה זה:** הופיע בזמן `git branch -d`. ב-Windows, תוכנה אחרת (VS Code, סייר הקבצים, אנטי-וירוס) מחזיקה באותו רגע תיקייה ריקה ש-Git מנסה למחוק.

**מה עושים:**
1. לוחצים `y` פעם או פעמיים.
2. אם זה עדיין נכשל, לוחצים `n`. התיקייה ריקה ולא מפריעה.
3. בודקים עם `git branch` שה-branch כבר לא ברשימה. אם הוא עדיין שם, סוגרים את VS Code ומנסים שוב.

---

### `error: the branch 'feature/...' is not fully merged`

**מה זה:** Git לא מזהה שהשינויים כבר מוזגו. זה קורה כשה-PR מוזג בשיטה **Squash and merge** או **Rebase and merge**, שבהן ה-commit ב-`main` מקבל מזהה חדש.

**מה עושים:** בודקים ב-GitHub שה-PR באמת מוזג (סטטוס **Merged** בסגול), ואז מוחקים עם D גדולה:

```powershell
git branch -D feature/hello-page
```

---

### `git fetch --prune` לא מחק את `origin/feature/...`

**מה זה:** ה-branch עדיין קיים ב-GitHub. `--prune` מסיר רק הפניות ל-branches שכבר נמחקו שם.

**מה עושים:** מוחקים את ה-branch ב-GitHub (כפתור **Delete branch** בדף ה-PR, או `git push origin --delete <שם>`), ואז מריצים שוב `git fetch --prune`.

כדי לבדוק אילו branches קיימים כרגע ב-GitHub:

```powershell
git ls-remote --heads origin
```

---

### עבדתי בטעות ישר על main

אם עוד לא עשיתם commit, פשוט יוצרים branch עכשיו:

```powershell
git checkout -b feature/my-change
```

השינויים שלא נשמרו עוברים יחד איתכם ל-branch החדש. ממשיכים משלב 4.

---

## דף עזר מהיר

```powershell
# --- התחלה ---
git checkout main                     # עוברים ל-main
git pull                              # מעדכנים מ-GitHub
git checkout -b feature/<שם>          # יוצרים branch חדש ועוברים אליו

# --- עבודה ---
git status                            # מה השתנה?
git diff                              # אילו שורות השתנו?
git add <קבצים>                       # בוחרים קבצים ל-commit
git commit -m "תיאור השינוי"          # שומרים commit
git push -u origin feature/<שם>       # מעלים ל-GitHub (בפעם הראשונה)
git push                              # מעלים commits נוספים

# --- PR ---
gh pr create                          # יוצרים PR (או דרך האתר)

# --- אחרי ה-merge ---
git checkout main
git pull
git branch -d feature/<שם>            # מוחקים את ה-branch המקומי
git push origin --delete feature/<שם> # מוחקים את ה-branch ב-GitHub
git fetch --prune                     # מנקים הפניות ישנות
```

</div>
