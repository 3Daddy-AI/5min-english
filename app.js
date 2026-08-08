"use strict";

/* ---------- 基本定義 ---------- */

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const SKILLS = ["speaking", "writing", "reading", "listening"];
const UNITS = ["vocab", ...SKILLS];
const DIAG_ANSWERS = { vocab: "b", grammar: "b" };
const VOCAB_DAILY = 10;
const VOCAB_NEW_PER_DAY = 4; // 復習が溜まっていても、新出単語は最低これだけ毎日出す
const SRS_INTERVALS = [0, 1, 2, 4, 7, 15]; // box(1-5) -> 次回までの日数

const goalMeta = {
  travel: { label: "旅行・海外生活", focus: "質問力と聞き返し" },
  business: { label: "仕事・会議", focus: "要件確認と合意形成" },
  study: { label: "留学・授業", focus: "説明理解と意見表明" },
  exam: { label: "試験・資格", focus: "正確性と時間配分" },
  daily: { label: "日常会話", focus: "自然な反応と雑談" }
};

/* ---------- 課題プール（目的 × 難度 × 技能 × 3課題） ----------
   t: タイトル / p: 指示 / x: 読解パッセージ / s: リスニング音声スクリプト
   m: 模範解答 / k: キーフレーズ（小文字） */

const taskPools = {
  travel: {
    basic: {
      speaking: [
        { t: "乗り継ぎゲートを尋ねる", p: "空港のスタッフに、乗り継ぎゲートの場所を丁寧に尋ねてください。", m: "Excuse me, could you tell me where the transfer gate is?", k: ["excuse me", "could you", "gate"] },
        { t: "レストランで注文する", p: "チキンサンドとコーヒーを丁寧に注文してください。", m: "Could I have the chicken sandwich and a coffee, please?", k: ["could i have", "please"] },
        { t: "駅への道を尋ねる", p: "通行人に、ここから駅への行き方を尋ねてください。", m: "Excuse me, how can I get to the station from here?", k: ["excuse me", "how can i get", "station"] }
      ],
      writing: [
        { t: "ホテルに依頼メール", p: "遅いチェックイン（23時ごろ）と静かな部屋をお願いする短いメールを書いてください。", m: "Hello, I have a reservation for tomorrow. Could we check in late, around 11 p.m.? We would also like a quiet room. Thank you.", k: ["check in", "could", "thank"] },
        { t: "忘れ物の問い合わせ", p: "昨日802号室にジャケットを忘れたかもしれません。確認をお願いするメッセージを書いてください。", m: "Hello, I think I left my jacket in room 802 yesterday. Could you check and let me know? Thank you.", k: ["left my", "could you", "thank"] },
        { t: "タクシーの手配", p: "明日朝9時に空港行きのタクシーをフロントに頼むメッセージを書いてください。部屋番号は502です。", m: "Hi, could you book a taxi to the airport for 9 a.m. tomorrow? My room number is 502.", k: ["could you", "taxi", "tomorrow"] }
      ],
      reading: [
        { t: "駅の掲示を読む", x: "The 9:15 train to Boston is delayed by 20 minutes. Passengers for New York, please transfer at Central Station, platform 4.", q: "掲示によると、何分遅れで、どこで乗り換えるべき？", choices: ["20分遅れで、セントラル駅の4番線で乗り換える", "10分遅れで、セントラル駅の2番線で乗り換える", "20分遅れだが、乗り換えの必要はない"], correct: 0 },
        { t: "ホテルの案内を読む", x: "Breakfast is served from 6:30 to 10:00 on the 2nd floor. The pool is closed on Mondays.", q: "案内によると、朝食とプールについて正しいのは？", choices: ["朝食は1階で7:00〜10:00、プールは日曜休み", "朝食は2階で6:30〜10:00、プールは月曜休み", "朝食は2階で6:30〜10:00、プールは無休"], correct: 1 },
        { t: "空港の標識を読む", x: "Passengers with connecting flights should proceed to Gate B12. Please have your boarding pass ready.", q: "掲示によると、乗り継ぎ客がすべきことは？", choices: ["B12ゲートへ行き、搭乗券を用意しておく", "B21ゲートへ行き、パスポートを用意しておく", "そのまま自分の到着ゲートで待つ"], correct: 0 }
      ],
      listening: [
        { t: "搭乗アナウンス", s: "Attention passengers. Flight 208 to Chicago is now boarding at gate 15." },
        { t: "ホテルのフロント", s: "Welcome to City Hotel. Your room is on the fifth floor. Here is your key." },
        { t: "車内アナウンス", s: "The next stop is Central Station. Please change here for the airport line." }
      ]
    },
    plus: {
      speaking: [
        { t: "欠航便の交渉", p: "フライトが欠航になりました。次の便への振替を依頼し、明朝までに到着したい事情も伝えてください。", m: "My flight was canceled. Could you rebook me on the next available flight? I need to arrive by tomorrow morning.", k: ["canceled", "rebook", "next"] },
        { t: "部屋の不具合を伝える", p: "エアコンが動きません。修理か部屋の変更を丁寧に依頼してください。", m: "I'm afraid the air conditioner in my room isn't working. Could you send someone to fix it, or move me to another room?", k: ["afraid", "working", "another room"] },
        { t: "現地の人に聞く", p: "初めて来た街で、1日しかない場合のおすすめを尋ねてください。", m: "This is my first time here. What do you recommend seeing if I only have one day?", k: ["first time", "recommend", "one day"] }
      ],
      writing: [
        { t: "返金依頼メール", p: "5月3日のツアーが悪天候で中止に。予約番号5024の返金方法を尋ねるメールを書いてください。", m: "Hello, my tour on May 3 was canceled due to the weather. Could you tell me how to get a refund? My booking number is 5024. Thank you.", k: ["refund", "booking", "canceled"] },
        { t: "宿のホストへ質問", p: "到着は22時ごろ。レイトチェックインの可否と、近くに駐車場があるか尋ねてください。", m: "Hi, we will arrive around 10 p.m. Is late check-in possible? Also, is there parking near the apartment?", k: ["arrive", "late check-in", "parking"] },
        { t: "宿泊レビューを書く", p: "立地とスタッフは良かったが部屋は写真より狭かった、それでもまた泊まりたい、というレビューを書いてください。", m: "The location was perfect and the staff were friendly. However, the room was smaller than the photos. Overall, I would stay here again.", k: ["however", "overall", "would"] }
      ],
      reading: [
        { t: "運休のお知らせ", x: "Due to a strike, all trains on the Blue Line are suspended this weekend. Replacement buses run every 30 minutes from the main square, but expect delays of up to one hour.", q: "お知らせによると、正しい対応は？", choices: ["ブルーラインは運休なので、メイン広場から代替バスに乗り、最大1時間の余裕を見る", "ブルーラインは通常運行だが、本数が半分になる", "代替バスはメイン広場ではなく、駅から出ている"], correct: 0 },
        { t: "旅行保険の注意書き", x: "This policy covers medical costs up to $50,000 but does not cover lost baggage unless it was checked in.", q: "この保険について正しいのは？", choices: ["医療費も荷物の紛失も、条件なく全額補償される", "医療費は5万ドルまで補償されるが、荷物の紛失は預け入れた場合のみ補償される", "医療費は補償されないが、荷物の紛失は全額補償される"], correct: 1 },
        { t: "免税のルール", x: "Visitors may claim a tax refund on purchases over $100 made at participating stores. Keep your receipts and show them at the airport counter before check-in.", q: "免税を受けるために必要なことは？", choices: ["レシートは不要だが、パスポートの提示が必要", "チェックイン後に、税関で申請書を提出する", "レシートを保管し、チェックイン前に空港カウンターで提示する"], correct: 2 }
      ],
      listening: [
        { t: "バスの経路変更", s: "Ladies and gentlemen, due to heavy traffic, this bus will take a different route. If you need City Museum, please get off at the next stop." },
        { t: "アップグレードの案内", s: "Your room upgrade is confirmed. Breakfast and pool access are included at no extra charge." },
        { t: "終電のアナウンス", s: "The last train to the airport leaves at eleven forty from platform two. Please do not miss it." }
      ]
    }
  },
  business: {
    basic: {
      speaking: [
        { t: "締切と担当を確認する", p: "会議の最後に、締切が金曜で合っているか、レポート担当は誰かを確認してください。", m: "Just to confirm, the deadline is Friday, right? Who is in charge of the report?", k: ["confirm", "deadline", "who"] },
        { t: "はじめての自己紹介", p: "営業チームのケンとして、担当エリアを添えて自己紹介してください。", m: "Hello, I'm Ken from the sales team. I'm in charge of the Tokyo area. Nice to meet you.", k: ["i'm", "in charge", "nice to meet"] },
        { t: "丁寧に聞き返す", p: "相手の説明が速すぎました。もう一度ゆっくり言ってもらうよう頼んでください。", m: "Sorry, could you say that again more slowly? I want to make sure I understand.", k: ["sorry", "again", "make sure"] }
      ],
      writing: [
        { t: "会議の欠席連絡", p: "明日の会議をクライアント訪問のため欠席する連絡と、議事録の共有依頼を書いてください。", m: "Hello, I'm afraid I can't join tomorrow's meeting because of a client visit. Could you share the notes later? Thank you.", k: ["afraid", "join", "could you"] },
        { t: "資料の送付メール", p: "売上レポートを添付して送るときの短いメールを書いてください。", m: "Hi, please find the sales report attached. Let me know if you have any questions.", k: ["attached", "let me know"] },
        { t: "打ち合わせの日程調整", p: "火曜14時を提案し、ダメなら木曜午前も空いていると伝える返信を書いてください。", m: "Thank you for your email. How about Tuesday at 2 p.m.? If that doesn't work, I'm also free on Thursday morning.", k: ["how about", "work", "free"] }
      ],
      reading: [
        { t: "予定変更のメモ", x: "Team, the client moved our demo from May 10 to May 8. Please finish the slides by May 6 and send them to Anna for review.", q: "メモによると、新しい締切と提出先は？", choices: ["5月8日までにスライドを完成させ、上司に送る", "5月6日までにスライドを完成させ、アンナに送る", "5月10日までにスライドを完成させ、クライアントに送る"], correct: 1 },
        { t: "経費ルールの変更", x: "Starting next month, all expense reports must be submitted online by the 25th. Paper forms will no longer be accepted.", q: "変更後のルールとして正しいのは？", choices: ["来月から経費報告は紙のみになり、オンラインは廃止される", "経費報告の締切は25日から月末に延長される", "来月から経費報告はオンラインで25日までに提出し、紙の用紙は使えない"], correct: 2 },
        { t: "オフィス閉鎖の連絡", x: "The office will be closed on Friday for maintenance. Please work from home and keep Slack open during business hours.", q: "連絡によると、金曜日にすべきことは？", choices: ["在宅勤務にし、業務時間中はSlackを開いておく", "オフィスに出社し、通常通り勤務する", "休暇を取り、Slackも確認しなくてよい"], correct: 0 }
      ],
      listening: [
        { t: "会議の冒頭", s: "Let's start the meeting. First, a quick update on the schedule. The release date moves to next Wednesday." },
        { t: "画面共有の確認", s: "Can everyone see my screen? Today I want to talk about the budget for the next quarter." },
        { t: "会議のまとめ", s: "Thanks everyone. To sum up, John will contact the client, and we will meet again on Friday." }
      ]
    },
    plus: {
      speaking: [
        { t: "懸念を伝えて代案を出す", p: "相手の案に一定の理解を示しつつ、コスト面の懸念を伝え、2案の比較を提案してください。", m: "I see your point, but I'm concerned about the cost. Could we compare two options before deciding?", k: ["your point", "concerned", "options"] },
        { t: "スケジュール変更を提案", p: "ローンチを6月に延ばす提案と、その利点（テスト期間が2週間増える）を伝えてください。", m: "I'd like to suggest moving the launch to June. That would give us two more weeks for testing.", k: ["suggest", "would give", "testing"] },
        { t: "進捗を報告する", p: "全体は順調、開発は80%完了、ただし人員不足でテストがやや遅れ、と報告してください。", m: "We're on track overall. Development is 80 percent done, but testing is slightly behind because of a staffing issue.", k: ["on track", "behind", "because"] }
      ],
      writing: [
        { t: "議事録メール", p: "決定事項（6月1日ローンチ）、未決事項（プレミアム価格）、次のアクション（ケンが金曜までにプレスリリース案）を含む議事録を書いてください。", m: "Hi all, here is a summary of today's meeting. Decided: we will launch on June 1. Open: pricing for the premium plan. Next steps: Ken will draft the press release by Friday.", k: ["summary", "decided", "next steps"] },
        { t: "丁寧な催促メール", p: "先週送った契約書の状況を、角を立てずに確認するメールを書いてください。", m: "I hope you're doing well. I'm writing to follow up on the contract I sent last week. Could you let me know the status when you have a moment?", k: ["follow up", "status", "moment"] },
        { t: "提案を断るメール", p: "提案への感謝を伝えつつ今回は見送ること、今後の協業に期待することを丁寧に書いてください。", m: "Thank you for the proposal. After careful consideration, we have decided not to move forward this time. We appreciate your effort and hope to work together in the future.", k: ["consideration", "move forward", "appreciate"] }
      ],
      reading: [
        { t: "契約条件を読む", x: "The new vendor offers a 15% discount for annual contracts, but the cancellation fee is high: 50% of the remaining balance. Legal suggests a 6-month pilot before committing.", q: "この契約について、法務部の提案は？", choices: ["割引率をさらに上げるよう交渉する", "即座に本契約を結び、割引を最大化する", "解約料が高いリスクがあるため、まず6ヶ月の試験導入を行う"], correct: 2 },
        { t: "業績レポートを読む", x: "Q2 revenue grew 8% year over year, driven by the enterprise segment. However, churn in the small-business segment rose to 6%, which may offset gains next quarter.", q: "レポートの内容として正しいのは？", choices: ["売上は法人部門により8%増加したが、中小企業の解約率が6%に上昇した", "売上は中小企業部門により8%増加し、解約率はどの部門も低下した", "売上は前年比で減少したが、解約率は改善した"], correct: 0 },
        { t: "セキュリティ通達を読む", x: "Following the security audit, all staff must enable two-factor authentication by March 15. Accounts without it will be suspended until IT confirms compliance.", q: "通達によると、3月15日までにすべきことは？", choices: ["パスワードを変更する。しないと罰金が科される", "二要素認証は任意で、設定しなくても問題ない", "二要素認証を有効にする。しないとアカウントが停止される"], correct: 2 }
      ],
      listening: [
        { t: "会議での反対意見", s: "Before we close, one concern. If we cut the testing phase, support tickets may increase. I suggest we keep the original schedule." },
        { t: "価格交渉の報告", s: "The client asked for a discount. I proposed extending the contract to two years instead of lowering the price." },
        { t: "採用凍結の共有", s: "Quick update. Hiring is frozen until next quarter, so please plan the roadmap with the current team size." }
      ]
    }
  },
  study: {
    basic: {
      speaking: [
        { t: "課題について質問する", p: "教授に、課題の説明をもう一度お願いし、締切が不安だと伝えてください。", m: "Excuse me, professor. Could you explain the assignment again? I'm not sure about the deadline.", k: ["excuse me", "explain", "deadline"] },
        { t: "クラスメイトに頼む", p: "同じ授業のクラスメイトに、月曜のノートを借りられないか尋ねてください。", m: "Hi, are you also in Professor Lee's class? Could I borrow your notes from Monday?", k: ["could i borrow", "notes"] },
        { t: "図書館で本を探す", p: "司書に、探している本の場所を尋ねてください。", m: "Excuse me, I'm looking for this book. Could you tell me where I can find it?", k: ["looking for", "could you", "find"] }
      ],
      writing: [
        { t: "教授への欠席メール", p: "体調不良で今日の授業を欠席したこと、来週までに読むべきものを尋ねるメールを書いてください。", m: "Dear Professor Lee, I'm sorry, but I was sick and missed today's class. Could you tell me what I should read for next week? Thank you.", k: ["professor", "missed", "could you"] },
        { t: "短い意見文", p: "オンライン授業の利点と課題について、自分の意見を3文程度で書いてください。", m: "I think online classes are useful because we can save time. However, it is hard to ask questions. So I prefer a mix of both.", k: ["i think", "because", "however"] },
        { t: "掲示板で仲間募集", p: "コースの掲示板で、勉強会に参加したいと投稿してください。", m: "Hi everyone, I'm new to this course. I'm interested in joining a study group. Is anyone meeting this week?", k: ["new", "study group", "anyone"] }
      ],
      reading: [
        { t: "課題の要件を読む", x: "The essay is due on Friday at 5 p.m. It should be 500 words and include at least two sources. Late work loses 10% per day.", q: "課題の条件として正しいのは？", choices: ["500語で出典2つ、金曜17時締切。遅れると1日10%減点される", "300語で出典1つ、月曜9時締切。遅れても減点はない", "500語で出典不要、金曜17時締切。遅れると提出不可になる"], correct: 0 },
        { t: "教科書の要点を読む", x: "Chapter 3 argues that habits form through repetition and reward. The author gives the example of morning exercise becoming automatic after 60 days.", q: "この章の主張として正しいのは？", choices: ["習慣は意志の力だけで作られ、反復は関係ない", "習慣は反復と報酬によって形成され、例えば運動は60日で自動的になる", "習慣が身につくまでには、最低1年はかかる"], correct: 1 },
        { t: "オフィスアワー案内", x: "Office hours are Tuesdays 2-4 p.m. Book a slot online. For quick questions, use the course forum, where TAs reply within 24 hours.", q: "質問したいときの選択肢として正しいのは？", choices: ["毎日いつでもオフィスアワーがあり、予約は不要", "火曜のオフィスアワーを予約するか、掲示板で質問すればTAが24時間以内に返信する", "質問はメールのみで受け付け、返信は1週間かかる"], correct: 1 }
      ],
      listening: [
        { t: "授業の始まり", s: "Today we will cover chapter five. Before that, please hand in your homework from last week." },
        { t: "小テストの案内", s: "Remember, the quiz on Friday covers everything up to page ninety. Bring a pencil and your student ID." },
        { t: "グループ課題の説明", s: "For the group project, you will work in teams of four. Choose your topic by next Monday." }
      ]
    },
    plus: {
      speaking: [
        { t: "ディスカッションで反論", p: "相手の意見を認めつつ、記事のデータは逆を示していると指摘し、図2を一緒に見ようと提案してください。", m: "That's an interesting point. However, the data in the article suggests the opposite. Could we look at figure two together?", k: ["interesting point", "however", "data"] },
        { t: "プレゼンの導入", p: "再生可能エネルギーについて、背景→2案の比較→提言の順で話すと予告する導入を作ってください。", m: "Today I'm going to talk about renewable energy. First, I'll explain the background. Then I'll compare two solutions and give my recommendation.", k: ["going to talk", "first", "then"] },
        { t: "成績の付け方を確認", p: "最終成績の計算方法、特に授業参加が何割かを教授に確認してください。", m: "Could you clarify how the final grade is calculated? Specifically, how much does class participation count?", k: ["clarify", "calculated", "participation"] }
      ],
      writing: [
        { t: "主張のある段落", p: "オンライン学習の長所と短所に触れつつ、大学はどうすべきかまで書いてください。", m: "While online learning offers flexibility and lower costs, it requires strong self-discipline. Students who lack structure often fall behind. Therefore, universities should combine online content with regular in-person sessions.", k: ["while", "therefore", "in-person"] },
        { t: "研究相談のメール", p: "論文のテーマを伝え、アウトラインを添付したので今週相談する時間をもらえないか、教授に依頼してください。", m: "Dear Professor, I'm writing my paper on language learning apps. Would you have time this week to discuss my outline? I have attached a draft.", k: ["paper", "would you have time", "attached"] },
        { t: "奨学金エッセイの核", p: "自分の目標と、このプログラムでなければならない理由を3文で書いてください。", m: "Studying abroad will help me bridge my engineering background with global experience. My goal is to develop affordable water filters, and this program offers the exact lab experience I need.", k: ["goal", "experience", "program"] }
      ],
      reading: [
        { t: "研究結果を読む", x: "The study followed 2,000 students over three years. Those who slept fewer than six hours scored 12% lower on average. However, the authors note that stress, not sleep alone, may explain part of the gap.", q: "この研究について正しいのは？", choices: ["睡眠時間はスコアに一切影響しないことが分かった", "睡眠6時間未満の学生の方が、スコアが12%高かった", "睡眠6時間未満の学生はスコアが12%低かったが、その差の一部はストレスで説明できる可能性がある"], correct: 2 },
        { t: "賛否のある理論を読む", x: "Critics argue the theory ignores cultural context. Supporters respond that its core claims have been replicated in over 30 countries, though effect sizes vary widely.", q: "批判側と擁護側の主張として正しいのは？", choices: ["批判側も擁護側も、この理論は完全に誤りだと結論づけている", "批判側は文化的文脈の無視を指摘し、擁護側は30ヶ国以上での再現性を主張する", "擁護側は文化を無視していると認め、批判側は再現性を主張している"], correct: 1 },
        { t: "学部の提案を読む", x: "Enrollment in humanities has fallen 25% in a decade. The dean proposes joint degrees with computer science, arguing that employers value writing plus technical skills.", q: "学部長の提案の背景として正しいのは？", choices: ["人文系の人気が上昇したため、定員を増やす提案をしている", "人文系を廃止し、コンピュータサイエンス学部に統合する提案をしている", "人文系の在籍者が10年で25%減少したため、コンピュータサイエンスとの共同学位を提案している"], correct: 2 }
      ],
      listening: [
        { t: "講義の構成を聞く", s: "There are three main causes of the revolution. Economic pressure, new ideas, and a weak government. Let's start with the economy." },
        { t: "中間試験の説明", s: "Your midterm will be an open-book essay. You will have two hours, and you must cite at least three readings from class." },
        { t: "休講と代替課題", s: "Next week's seminar is canceled. Instead, please watch the recorded lecture and post one question to the forum by Thursday." }
      ]
    }
  },
  exam: {
    basic: {
      speaking: [
        { t: "1分自己紹介", p: "名前・仕事・趣味・最近始めたことを入れて、試験形式の自己紹介を作ってください。", m: "My name is Yuki. I work at a small IT company. In my free time, I enjoy running and cooking. Recently I started studying English to travel abroad.", k: ["my name", "free time", "recently"] },
        { t: "写真描写", p: "「カフェで注文する女性と、後ろに並ぶ2人」の写真を describing する解答を作ってください。", m: "In this picture, a woman is ordering coffee at a cafe. There are two people waiting behind her. It looks like a busy morning.", k: ["in this picture", "there are", "looks like"] },
        { t: "好みを理由付きで", p: "朝と夜、どちらに勉強したいかを理由と例を添えて答えてください。", m: "I prefer studying in the morning because my mind is fresh. For example, I remember words better before breakfast.", k: ["prefer", "because", "for example"] }
      ],
      writing: [
        { t: "賛否 + 理由2つ", p: "「リモートワークは生産性を上げる」に賛成か反対か、理由を2つ挙げて書いてください。", m: "I agree that remote work improves productivity. First, workers save commuting time. Second, they can focus better without office noise. Therefore, companies should allow it.", k: ["first", "second", "therefore"] },
        { t: "グラフを説明する", p: "「1〜6月で売上が増加、4月が最大の伸び、コストは横ばい」というグラフを説明してください。", m: "The graph shows that sales increased from January to June. The biggest rise was in April. In contrast, costs stayed almost the same.", k: ["shows", "increased", "in contrast"] },
        { t: "Eメール問題", p: "ワークショップへの招待に、お礼→出席の意思→持ち物の質問、の順で返信してください。", m: "Dear Mr. Smith, thank you for your invitation. I would be happy to attend the workshop on Saturday. Could you tell me what I should bring?", k: ["thank you for", "happy to", "could you"] }
      ],
      reading: [
        { t: "お知らせ問題", x: "The city library will move to a new building in September. During August, all books must be returned, and online services will pause for two weeks.", q: "お知らせの内容として正しいのは？", choices: ["図書館は8月に移転し、9月中に本を返却する", "図書館は9月に移転し、8月中に本を返却、オンラインサービスは2週間停止する", "図書館の移転に伴い、オンラインサービスは今後廃止される"], correct: 1 },
        { t: "手続きの読み取り", x: "To register for the exam, create an account, upload a photo, and pay the fee by June 1. Late registration costs an extra $30.", q: "手続きについて正しいのは？", choices: ["6月1日までに登録すれば、支払いは後払いでよい", "写真のアップロードは任意で、なくても登録できる", "6月1日までに登録と支払いを済ませないと、追加で30ドルかかる"], correct: 2 },
        { t: "文脈から語義推測", x: "The manager was reluctant to approve the budget, asking for more data twice before finally agreeing.", q: "reluctant の意味として最も近いのは？", choices: ["積極的で乗り気な", "気が進まない・ためらっている", "怒っている・苛立っている"], correct: 1 }
      ],
      listening: [
        { t: "場面推測の練習", s: "Question one. Where does the conversation probably take place? Listen carefully to words like menu, order, and bill." },
        { t: "予約変更を聞き取る", s: "The man wants to change his appointment from Tuesday to Thursday afternoon." },
        { t: "店内アナウンス", s: "Attention shoppers. All winter items are thirty percent off until Sunday." }
      ]
    },
    plus: {
      speaking: [
        { t: "45秒意見スピーチ", p: "「学生は制服を着るべきか」について、立場と理由2つで45秒スピーチの原稿を作ってください。", m: "Some people think students should wear uniforms. I disagree for two reasons. First, clothes are a form of self-expression. Second, uniforms are expensive for families. That's why I support free dress.", k: ["disagree", "first", "second"] },
        { t: "講義の要約スピーキング", p: "「都市が暑くなる理由（熱を吸収する路面・木の減少）」という講義を要約する解答を作ってください。", m: "The lecture explained why cities are getting hotter. The professor gave two examples: dark surfaces that absorb heat and fewer trees. This supports the reading's main claim.", k: ["lecture", "examples", "supports"] },
        { t: "二択で立場を選ぶ", p: "インターンと夏期講習、どちらを選ぶか仮定法を使って理由付きで答えてください。", m: "If I had to choose, I would take the internship rather than the summer course, because practical experience matters more in my field.", k: ["if i had to", "rather than", "because"] }
      ],
      writing: [
        { t: "意見エッセイの核", p: "「オンラインショッピングと地元商店」について、譲歩→主張→理由の構造で書いてください。", m: "Although online shopping is convenient, it weakens local stores. Governments should support small businesses through lower taxes, because lively shopping streets make cities safer and more attractive.", k: ["although", "should", "because"] },
        { t: "統合ライティング", p: "リーディング（2035年にEVが主流）とレクチャー（電池不足・充電網の弱さ）の関係をまとめてください。", m: "The reading claims electric cars will dominate by 2035. However, the lecture points out battery shortages and weak charging networks, which cast doubt on that timeline.", k: ["claims", "however", "doubt"] },
        { t: "2時点のグラフ比較", p: "「2000年と2020年のエネルギー源構成（石炭45%→20%、再エネ3倍、ガス25%横ばい）」を比較して書いてください。", m: "The chart compares energy sources in 2000 and 2020. Coal fell sharply from 45% to 20%, while renewables tripled. Gas remained stable at around 25%.", k: ["compares", "while", "remained"] }
      ],
      reading: [
        { t: "通説への反証を読む", x: "Paragraph 2 contradicts the common belief that multitasking saves time. In experiments, switching tasks added up to 40% more completion time, especially for complex work.", q: "筆者の主張として正しいのは？", choices: ["マルチタスクは常に時間を節約し、効率を40%高める", "マルチタスクの影響は、単純な作業でのみ現れる", "マルチタスクは時間を節約せず、切り替えによって複雑な作業では最大40%多く時間がかかる"], correct: 2 },
        { t: "譲歩と主張を読む", x: "While the author concedes that tourism brings revenue, she maintains that unregulated growth damages the very sites tourists come to see, citing Venice as a cautionary tale.", q: "筆者が認めている点と主張している点として正しいのは？", choices: ["観光は収益を生まないと主張し、規制強化のみを訴えている", "観光が収益を生むことは認めつつ、規制のない成長が観光地を損なうと主張している", "観光の収益も、規制のない成長による損害も、どちらも否定している"], correct: 1 },
        { t: "因果関係の罠を読む", x: "The correlation between coffee and longevity disappeared once researchers controlled for income and exercise, suggesting earlier studies confused cause and effect.", q: "この研究が示したこととして正しいのは？", choices: ["コーヒーが長寿の直接の原因であることが、この研究で証明された", "運動だけが長寿に関係し、収入もコーヒーも無関係だと分かった", "収入と運動を調整すると、コーヒーと長寿の関連は消え、初期の研究は因果を取り違えていた可能性がある"], correct: 2 }
      ],
      listening: [
        { t: "主張と根拠を聞く", s: "The speaker argues that paper books will survive, mainly because readers remember more when they turn physical pages." },
        { t: "研究結果を聞く", s: "According to the study, people who wrote down three goals each morning finished twenty percent more tasks by Friday." },
        { t: "反対意見を聞く", s: "The professor disagrees with the textbook. She says the data is too old and the sample was too small to draw conclusions." }
      ]
    }
  },
  daily: {
    basic: {
      speaking: [
        { t: "週末の予定を話す", p: "友人に週末の予定を聞き、自分は新しいラーメン店に行こうと思っていると伝えてください。", m: "What are you doing this weekend? I'm thinking of trying that new ramen place.", k: ["weekend", "thinking of"] },
        { t: "相づちと深掘り", p: "旅行の話をしてくれた友人に、リアクション＋天気についての質問で返してください。", m: "Oh really? That sounds fun! How was the weather there?", k: ["really", "sounds", "how was"] },
        { t: "近況を伝える", p: "最近忙しいこと、でも日曜のジョギングを始めたことを話してください。", m: "I've been busy with work lately, but I started jogging on Sundays. It feels great.", k: ["been busy", "started", "feels"] }
      ],
      writing: [
        { t: "誘いを断って提案", p: "金曜は行けないと謝り、代わりに来週火曜を提案するチャット返信を書いてください。", m: "Sorry, I can't make it on Friday. How about next Tuesday instead? I'd love to catch up.", k: ["sorry", "make it", "how about"] },
        { t: "お礼のメッセージ", p: "昨晩の夕食のお礼と、次は自分がおごる、というメッセージを書いてください。", m: "Thank you so much for dinner last night! The pasta was amazing. Next time it's on me.", k: ["thank you", "amazing", "next time"] },
        { t: "遊びの計画を提案", p: "土曜の映画（19時の新作アクション）と、その後の夕食に誘うメッセージを書いてください。", m: "Do you want to see a movie this Saturday? There's a new action film at 7. We could grab dinner after.", k: ["do you want", "there's", "after"] }
      ],
      reading: [
        { t: "SNSの報告投稿", x: "Finally finished my first 10K run! My legs are dead but I'm so proud. Next goal: half marathon in October.", q: "投稿の内容として正しいのは？", choices: ["10kmランに失敗し、次はもう挑戦しないと決めた", "初めての10kmランを完走して誇らしく思っており、次は10月のハーフマラソンを目指している", "ハーフマラソンを完走し、次は10kmに挑戦する予定"], correct: 1 },
        { t: "友達からの連絡", x: "Hey, party's moved to Sam's place, same time. Bring something to drink. Oh, and it's a surprise, so don't text Alex!", q: "連絡の内容として正しいのは？", choices: ["パーティーは中止になり、代わりにサムの家に集まって飲むだけ", "パーティーの時間が変更になり、場所は変わらない", "パーティーはサムの家に変更、時間は同じ。飲み物を持参し、アレックスには秘密にする"], correct: 2 },
        { t: "カフェのレビュー", x: "New cafe alert: great flat white, quiet upstairs seating, free wifi. A bit pricey though. Perfect for remote work days.", q: "レビューの内容として正しいのは？", choices: ["コーヒーは普通だが、とても安くて席も騒がしい", "コーヒーが美味しく、静かな席とwifiがあるが、少し値段が高い", "wifiがなく、リモートワークには向いていない"], correct: 1 }
      ],
      listening: [
        { t: "待ち合わせの一言", s: "Hey, sorry I'm late. The train stopped for ten minutes. Did you order already?" },
        { t: "バーベキューの誘い", s: "I'm planning a small barbecue on Saturday. Can you bring some drinks? Around three o'clock." },
        { t: "コンサートの誘い", s: "Guess what? I got two tickets for the concert. Are you free next Friday night?" }
      ]
    },
    plus: {
      speaking: [
        { t: "ドラマの感想を語る", p: "話題のドラマについて、正直な感想（1期の方が良かったけどハマってる）を話してください。", m: "I've been watching that new drama everyone talks about. Honestly, the first season was better, but I'm still hooked.", k: ["honestly", "better", "still"] },
        { t: "相談に乗る", p: "仕事の悩みを打ち明けた友人に、共感→提案→味方だと伝える、の順で返してください。", m: "That sounds tough. Have you thought about talking to your manager directly? Whatever you decide, I'm on your side.", k: ["sounds tough", "have you thought", "your side"] },
        { t: "思い出話をする", p: "道に迷った末に地元の祭りにたどり着いた旅の思い出を、オチをつけて話してください。", m: "That trip was unforgettable. We got completely lost, ended up at a tiny local festival, and it turned out to be the best night.", k: ["unforgettable", "ended up", "turned out"] }
      ],
      writing: [
        { t: "久しぶりの近況メール", p: "昇進後忙しかったこと、沖縄で1週間休んだこと、相手の新居について尋ねることを含めて書いてください。", m: "It's been ages! Work has been hectic since the promotion, but I finally took a week off in Okinawa. How's the new apartment? Let's have a video call soon.", k: ["it's been", "finally", "how's"] },
        { t: "丁寧に断って代案", p: "誘いへの感謝→家庭の用事で行けない→日曜ブランチを代案（自分のおごり）の順で書いてください。", m: "I really appreciate the invite, but I have a family thing that day. Could we do brunch on Sunday instead? My treat.", k: ["appreciate", "instead", "treat"] },
        { t: "おすすめを紹介する", p: "気に入った本の流れで『Deep Work』を薦め、自分がどう変わったか、貸す約束も添えてください。", m: "If you liked that book, you should try Deep Work. It changed how I plan my mornings. I'll lend you my copy next time we meet.", k: ["you should try", "changed", "lend"] }
      ],
      reading: [
        { t: "海外移住の投稿", x: "Not gonna lie, moving abroad alone was terrifying at first. Three months in, I finally have a routine: morning market, work, evening runs by the river. Homesick? Sometimes. Regrets? Zero.", q: "投稿者の3ヶ月間の変化として正しいのは？", choices: ["3ヶ月経っても不安は消えず、帰国を考えている", "最初から順調で、一度も不安を感じたことがない", "最初は怖かったが、3ヶ月後には生活リズムができ、後悔はしていない"], correct: 2 },
        { t: "グループへの連絡", x: "PSA for the group: the hiking trail we planned is closed after last week's storm. Plan B is the coastal path. Slightly longer but the views are unreal. Meet at 8 sharp.", q: "連絡の内容として正しいのは？", choices: ["元のコースはそのまま使えるが、集合時間が早まった", "元のコースは閉鎖されたため、より長い海岸沿いの道を8時集合で歩く", "ハイキング自体が中止になった"], correct: 1 },
        { t: "あえての逆張り投稿", x: "Hot take: brunch is overrated. You wait an hour for eggs you could make at home. Give me a quiet morning coffee and a good bakery any day.", q: "投稿者の主張として正しいのは？", choices: ["ブランチは最高だと絶賛し、毎週行くべきだと勧めている", "家で作る卵料理はまずいので、ブランチの方が良いと主張している", "待ち時間が長いのでブランチは過大評価だと考え、コーヒーとパン屋を好んでいる"], correct: 2 }
      ],
      listening: [
        { t: "予定外の夜の話", s: "So the movie was sold out, and we ended up at a jazz bar next door. Best accident ever. You have to come next time." },
        { t: "家族の相談ごと", s: "My sister is thinking about quitting her job to study design. I told her to build some savings first, just in case." },
        { t: "アパートの近況", s: "Long story short, the landlord finally fixed the heater, but now the kitchen tap is leaking. This apartment keeps me busy." }
      ]
    }
  }
};

/* ---------- 単語デッキ（目的別 / w: 単語, ja: 意味, ex: 例文, exj: 例文の訳） ---------- */

const vocabDecks = {
  travel: [
    { w: "reservation", ja: "予約", ex: "I'd like to make a reservation for two nights.", exj: "2泊で予約をお願いしたいのですが。" },
    { w: "delay", ja: "遅延・遅れ", ex: "There is a 30-minute delay on this flight.", exj: "この便には30分の遅れが出ています。" },
    { w: "transfer", ja: "乗り換え（る）", ex: "You need to transfer at Central Station.", exj: "セントラル駅で乗り換える必要があります。" },
    { w: "luggage", ja: "手荷物", ex: "Can I leave my luggage at the front desk?", exj: "荷物をフロントに預けてもいいですか。" },
    { w: "boarding pass", ja: "搭乗券", ex: "Please show your boarding pass at the gate.", exj: "ゲートで搭乗券をご提示ください。" },
    { w: "departure", ja: "出発", ex: "The departure time has changed to 3 p.m.", exj: "出発時刻が午後3時に変更になりました。" },
    { w: "refund", ja: "返金", ex: "Can I get a refund for this ticket?", exj: "このチケットは返金してもらえますか。" },
    { w: "receipt", ja: "領収書・レシート", ex: "Could I have a receipt, please?", exj: "領収書をいただけますか。" },
    { w: "directions", ja: "道順", ex: "Could you give me directions to the museum?", exj: "博物館への道順を教えていただけますか。" },
    { w: "crowded", ja: "混雑した", ex: "The market gets crowded on weekends.", exj: "その市場は週末になると混雑します。" },
    { w: "available", ja: "空いている・利用できる", ex: "Is there a room available tonight?", exj: "今夜、空いている部屋はありますか。" },
    { w: "recommend", ja: "すすめる", ex: "What do you recommend on this menu?", exj: "このメニューの中でおすすめは何ですか。" },
    { w: "charge", ja: "料金・請求（する）", ex: "Is there an extra charge for breakfast?", exj: "朝食には追加料金がかかりますか。" },
    { w: "platform", ja: "（駅の）ホーム・番線", ex: "The train leaves from platform 4.", exj: "その列車は4番線から発車します。" },
    { w: "customs", ja: "税関", ex: "You have to go through customs first.", exj: "まず税関を通る必要があります。" },
    { w: "out of order", ja: "故障中", ex: "The elevator is out of order.", exj: "そのエレベーターは故障中です。" },
    { w: "itinerary", ja: "旅程", ex: "Could you send me the full itinerary before we leave?", exj: "出発前に旅程表をすべて送っていただけますか。" },
    { w: "currency", ja: "通貨", ex: "What's the local currency here?", exj: "ここの現地通貨は何ですか。" },
    { w: "exchange rate", ja: "為替レート", ex: "The exchange rate changes every day.", exj: "為替レートは毎日変わります。" },
    { w: "checkout", ja: "チェックアウト", ex: "What time is checkout tomorrow?", exj: "明日のチェックアウトは何時ですか。" },
    { w: "vacancy", ja: "空室", ex: "Do you have any vacancy for tonight?", exj: "今夜、空室はありますか。" },
    { w: "connecting flight", ja: "乗り継ぎ便", ex: "I have a connecting flight in two hours.", exj: "2時間後に乗り継ぎ便があります。" },
    { w: "round trip", ja: "往復", ex: "I'd like a round trip ticket to Boston.", exj: "ボストン行きの往復チケットをお願いします。" },
    { w: "one-way", ja: "片道", ex: "Is this ticket one-way or round trip?", exj: "このチケットは片道ですか、往復ですか。" },
    { w: "window seat", ja: "窓側の席", ex: "Could I have a window seat, please?", exj: "窓側の席をいただけますか。" },
    { w: "aisle seat", ja: "通路側の席", ex: "I prefer an aisle seat for long flights.", exj: "長時間のフライトでは通路側の席がいいです。" },
    { w: "baggage claim", ja: "手荷物受取所", ex: "Where is the baggage claim area?", exj: "手荷物受取所はどこですか。" },
    { w: "security check", ja: "保安検査", ex: "Please remove your shoes at the security check.", exj: "保安検査では靴を脱いでください。" },
    { w: "passport control", ja: "出入国審査", ex: "Passport control is on the second floor.", exj: "出入国審査は2階です。" },
    { w: "souvenir", ja: "お土産", ex: "I want to buy some souvenirs for my family.", exj: "家族へのお土産をいくつか買いたいです。" },
    { w: "sightseeing", ja: "観光", ex: "We spent the whole day sightseeing downtown.", exj: "一日中ダウンタウンを観光して過ごしました。" },
    { w: "guided tour", ja: "ガイド付きツアー", ex: "Is there a guided tour of the castle?", exj: "お城のガイド付きツアーはありますか。" },
    { w: "local specialty", ja: "名物・特産品", ex: "What's a local specialty I should try?", exj: "試すべき名物は何ですか。" },
    { w: "tip", ja: "チップ", ex: "Is it common to leave a tip here?", exj: "ここではチップを渡すのが一般的ですか。" },
    { w: "currency exchange", ja: "両替所", ex: "Where can I find a currency exchange office?", exj: "両替所はどこにありますか。" },
    { w: "overbooked", ja: "オーバーブッキングの", ex: "I'm sorry, this flight is overbooked.", exj: "申し訳ありませんが、この便はオーバーブッキングです。" },
    { w: "layover", ja: "乗り継ぎ待ち時間", ex: "We have a three-hour layover in Dallas.", exj: "ダラスで3時間の乗り継ぎ待ちがあります。" },
    { w: "non-smoking", ja: "禁煙の", ex: "Could I have a non-smoking room?", exj: "禁煙の部屋をお願いできますか。" },
    { w: "valid", ja: "有効な", ex: "Is my passport still valid for this trip?", exj: "私のパスポートはこの旅行に対してまだ有効ですか。" },
    { w: "lost and found", ja: "遺失物取扱所", ex: "I left my bag on the train. Where's the lost and found?", exj: "電車にバッグを忘れました。遺失物取扱所はどこですか。" }
  ],
  business: [
    { w: "deadline", ja: "締切", ex: "The deadline for the report is Friday.", exj: "レポートの締切は金曜日です。" },
    { w: "attach", ja: "添付する", ex: "I will attach the file to this email.", exj: "このメールにファイルを添付します。" },
    { w: "confirm", ja: "確認する・確定する", ex: "Can you confirm the meeting time?", exj: "会議の時間を確認してもらえますか。" },
    { w: "proposal", ja: "提案（書）", ex: "We reviewed the proposal yesterday.", exj: "私たちは昨日その提案書を検討しました。" },
    { w: "budget", ja: "予算", ex: "The budget for this project is limited.", exj: "このプロジェクトの予算は限られています。" },
    { w: "client", ja: "顧客・取引先", ex: "The client asked for a small change.", exj: "クライアントから小さな変更の依頼がありました。" },
    { w: "postpone", ja: "延期する", ex: "Let's postpone the meeting to next week.", exj: "会議を来週に延期しましょう。" },
    { w: "agenda", ja: "議題", ex: "The first item on the agenda is hiring.", exj: "議題の最初の項目は採用です。" },
    { w: "in charge of", ja: "〜の担当で", ex: "She is in charge of the new campaign.", exj: "彼女が新しいキャンペーンの担当です。" },
    { w: "follow up", ja: "追って確認する", ex: "I'll follow up with the client tomorrow.", exj: "明日クライアントに追って連絡します。" },
    { w: "negotiate", ja: "交渉する", ex: "We need to negotiate a better price.", exj: "もっと良い価格を交渉する必要があります。" },
    { w: "update", ja: "最新情報（を伝える）", ex: "Here's a quick update on the schedule.", exj: "スケジュールについて簡単な最新情報です。" },
    { w: "estimate", ja: "見積もり（る）", ex: "Could you send us an estimate by Friday?", exj: "金曜までに見積もりを送っていただけますか。" },
    { w: "urgent", ja: "至急の", ex: "This is urgent, so please reply today.", exj: "これは至急なので、今日中に返信してください。" },
    { w: "task", ja: "作業・タスク", ex: "I have three tasks left for today.", exj: "今日はあと3つタスクが残っています。" },
    { w: "schedule", ja: "予定（を組む）", ex: "Let me check my schedule first.", exj: "まず予定を確認させてください。" },
    { w: "invoice", ja: "請求書", ex: "Please send the invoice by the end of the month.", exj: "月末までに請求書を送ってください。" },
    { w: "colleague", ja: "同僚", ex: "I discussed the plan with my colleague first.", exj: "まず同僚とその計画について話し合いました。" },
    { w: "onboarding", ja: "新人研修・オンボーディング", ex: "Onboarding for new hires starts next Monday.", exj: "新入社員のオンボーディングは来週月曜に始まります。" },
    { w: "stakeholder", ja: "利害関係者", ex: "We need approval from all stakeholders.", exj: "すべての利害関係者からの承認が必要です。" },
    { w: "milestone", ja: "節目・マイルストーン", ex: "We reached the first milestone ahead of schedule.", exj: "最初のマイルストーンを予定より早く達成しました。" },
    { w: "draft", ja: "下書き（する）", ex: "Could you draft a reply for this client?", exj: "このクライアントへの返信の下書きをお願いできますか。" },
    { w: "approve", ja: "承認する", ex: "The manager approved the budget yesterday.", exj: "昨日、マネージャーが予算を承認しました。" },
    { w: "reschedule", ja: "予定を変更する", ex: "Can we reschedule the call to Thursday?", exj: "通話を木曜日に変更できますか。" },
    { w: "quarterly", ja: "四半期の", ex: "The quarterly report is due next week.", exj: "四半期報告書は来週締切です。" },
    { w: "overtime", ja: "残業", ex: "I had to work overtime to finish the report.", exj: "レポートを終わらせるために残業しなければなりませんでした。" },
    { w: "resign", ja: "退職する", ex: "She decided to resign at the end of the year.", exj: "彼女は年末に退職することを決めました。" },
    { w: "onsite", ja: "現地の・対面の", ex: "The meeting will be onsite this time.", exj: "今回の会議は現地開催です。" },
    { w: "remote work", ja: "リモートワーク", ex: "Remote work is allowed twice a week.", exj: "リモートワークは週2回まで認められています。" },
    { w: "headquarters", ja: "本社", ex: "The headquarters is located in New York.", exj: "本社はニューヨークにあります。" },
    { w: "supervisor", ja: "上司・監督者", ex: "Please check with your supervisor first.", exj: "まず上司に確認してください。" },
    { w: "performance review", ja: "人事評価", ex: "My performance review is scheduled for Friday.", exj: "私の人事評価は金曜日に予定されています。" },
    { w: "compliance", ja: "コンプライアンス・法令遵守", ex: "All staff must complete the compliance training.", exj: "全社員がコンプライアンス研修を修了する必要があります。" },
    { w: "revenue", ja: "収益", ex: "Revenue increased significantly this quarter.", exj: "今四半期は収益が大きく増加しました。" },
    { w: "layoff", ja: "人員削減", ex: "The company announced layoffs last month.", exj: "会社は先月、人員削減を発表しました。" },
    { w: "merger", ja: "合併", ex: "The merger was completed in March.", exj: "合併は3月に完了しました。" },
    { w: "shareholder", ja: "株主", ex: "Shareholders will vote on the proposal next week.", exj: "株主は来週その提案について投票します。" },
    { w: "logistics", ja: "物流", ex: "Logistics costs rose due to fuel prices.", exj: "燃料価格の上昇で物流コストが増加しました。" },
    { w: "vendor", ja: "業者・仕入先", ex: "We are switching to a new vendor next month.", exj: "来月、新しい業者に切り替えます。" },
    { w: "handover", ja: "引き継ぎ", ex: "Please prepare a handover document before you leave.", exj: "退職前に引き継ぎ資料を用意してください。" }
  ],
  study: [
    { w: "assignment", ja: "課題", ex: "The assignment is due next Monday.", exj: "その課題は来週月曜が締切です。" },
    { w: "lecture", ja: "講義", ex: "The lecture on history was interesting.", exj: "歴史の講義は興味深かったです。" },
    { w: "due", ja: "締切の・提出期限で", ex: "The essay is due on Friday.", exj: "エッセイは金曜が提出期限です。" },
    { w: "submit", ja: "提出する", ex: "Please submit your homework online.", exj: "宿題はオンラインで提出してください。" },
    { w: "source", ja: "出典・情報源", ex: "You need at least two sources for the essay.", exj: "エッセイには少なくとも2つの出典が必要です。" },
    { w: "summary", ja: "要約", ex: "Write a short summary of chapter three.", exj: "第3章の短い要約を書いてください。" },
    { w: "argue", ja: "主張する", ex: "The author argues that sleep improves memory.", exj: "著者は、睡眠が記憶を向上させると主張しています。" },
    { w: "evidence", ja: "根拠・証拠", ex: "There is strong evidence for this theory.", exj: "この理論には強い根拠があります。" },
    { w: "register", ja: "登録する・履修する", ex: "I forgot to register for the class.", exj: "その授業の履修登録をし忘れました。" },
    { w: "grade", ja: "成績", ex: "Participation counts for 20% of the grade.", exj: "授業参加が成績の20%を占めます。" },
    { w: "outline", ja: "アウトライン・構成案", ex: "Make an outline before you start writing.", exj: "書き始める前に構成案を作りましょう。" },
    { w: "participate", ja: "参加する", ex: "Please participate in the discussion.", exj: "議論に参加してください。" },
    { w: "revise", ja: "見直す・書き直す", ex: "I revised my essay twice before submitting.", exj: "提出する前にエッセイを2回書き直しました。" },
    { w: "cite", ja: "引用する", ex: "Remember to cite all your sources.", exj: "出典をすべて引用することを忘れないでください。" },
    { w: "research", ja: "研究・調査", ex: "Her research focuses on child language.", exj: "彼女の研究は子どもの言語に焦点を当てています。" },
    { w: "definition", ja: "定義", ex: "Check the definition in the glossary.", exj: "用語集で定義を確認してください。" },
    { w: "syllabus", ja: "シラバス・講義要項", ex: "Check the syllabus for the reading list.", exj: "読書リストはシラバスで確認してください。" },
    { w: "semester", ja: "学期", ex: "This semester has five courses.", exj: "今学期は5つの授業があります。" },
    { w: "tuition", ja: "授業料", ex: "Tuition increased by 5% this year.", exj: "今年、授業料が5%上がりました。" },
    { w: "scholarship", ja: "奨学金", ex: "She received a scholarship for graduate school.", exj: "彼女は大学院の奨学金を受けました。" },
    { w: "thesis", ja: "論文（卒論・修論）", ex: "My thesis is about renewable energy.", exj: "私の論文は再生可能エネルギーについてです。" },
    { w: "plagiarism", ja: "剽窃・盗用", ex: "Plagiarism can lead to a failing grade.", exj: "剽窃は単位の不合格につながることがあります。" },
    { w: "peer review", ja: "ピアレビュー", ex: "The paper went through peer review.", exj: "その論文はピアレビューを受けました。" },
    { w: "major", ja: "専攻", ex: "What is your major at university?", exj: "大学での専攻は何ですか。" },
    { w: "elective", ja: "選択科目", ex: "I'm taking an elective in psychology.", exj: "心理学の選択科目を取っています。" },
    { w: "GPA", ja: "成績平均値", ex: "You need a GPA of 3.0 to apply.", exj: "応募には3.0のGPAが必要です。" },
    { w: "deadline extension", ja: "締切延長", ex: "Could I ask for a deadline extension?", exj: "締切の延長をお願いできますか。" },
    { w: "office hours", ja: "オフィスアワー", ex: "The professor's office hours are on Tuesday.", exj: "教授のオフィスアワーは火曜日です。" },
    { w: "midterm", ja: "中間試験", ex: "The midterm covers the first five chapters.", exj: "中間試験は最初の5章が範囲です。" },
    { w: "final exam", ja: "期末試験", ex: "The final exam is in two weeks.", exj: "期末試験は2週間後です。" },
    { w: "workshop", ja: "ワークショップ", ex: "The writing workshop was very helpful.", exj: "そのライティングワークショップはとても役立ちました。" },
    { w: "hand in", ja: "提出する", ex: "Please hand in your essay by Monday.", exj: "月曜までにエッセイを提出してください。" },
    { w: "literature review", ja: "先行研究のレビュー", ex: "The literature review took longer than expected.", exj: "先行研究のレビューは予想より時間がかかりました。" },
    { w: "hypothesis", ja: "仮説", ex: "Our hypothesis was not supported by the data.", exj: "私たちの仮説はデータによって裏付けられませんでした。" },
    { w: "data analysis", ja: "データ分析", ex: "Data analysis is the hardest part of my project.", exj: "データ分析は私のプロジェクトで最も難しい部分です。" },
    { w: "reference list", ja: "参考文献リスト", ex: "Don't forget the reference list at the end.", exj: "最後に参考文献リストを忘れずに。" },
    { w: "proofread", ja: "校正する", ex: "Could you proofread my draft tonight?", exj: "今夜、下書きを校正してもらえますか。" },
    { w: "feedback", ja: "フィードバック", ex: "The teacher gave detailed feedback on my essay.", exj: "先生が私のエッセイに詳しいフィードバックをくれました。" },
    { w: "credit", ja: "単位", ex: "You need 120 credits to graduate.", exj: "卒業には120単位が必要です。" },
    { w: "study group", ja: "勉強会", ex: "We meet for a study group every Wednesday.", exj: "毎週水曜日に勉強会をしています。" }
  ],
  exam: [
    { w: "describe", ja: "描写する・説明する", ex: "Describe the picture in three sentences.", exj: "その写真を3文で描写しなさい。" },
    { w: "compare", ja: "比較する", ex: "Compare the two graphs briefly.", exj: "2つのグラフを簡潔に比較しなさい。" },
    { w: "increase", ja: "増加（する）", ex: "Sales increased by 10% last year.", exj: "昨年、売上は10%増加しました。" },
    { w: "decrease", ja: "減少（する）", ex: "The number of visitors decreased in winter.", exj: "冬は来訪者数が減少しました。" },
    { w: "statement", ja: "記述・主張", ex: "Is the statement true or false?", exj: "その記述は正しいですか、それとも誤りですか。" },
    { w: "passage", ja: "（読解の）本文", ex: "Read the passage and answer the questions.", exj: "本文を読んで、問いに答えなさい。" },
    { w: "purpose", ja: "目的", ex: "What is the main purpose of this email?", exj: "このメールの主な目的は何ですか。" },
    { w: "infer", ja: "推測する", ex: "What can you infer from the last paragraph?", exj: "最終段落から何が推測できますか。" },
    { w: "conclude", ja: "結論づける", ex: "The author concludes that habits matter most.", exj: "著者は、習慣が最も重要だと結論づけています。" },
    { w: "opinion", ja: "意見", ex: "Give your opinion with two reasons.", exj: "理由を2つ挙げて意見を述べなさい。" },
    { w: "agree", ja: "賛成する", ex: "I agree with this idea for two reasons.", exj: "2つの理由から、この考えに賛成です。" },
    { w: "disagree", ja: "反対する", ex: "I disagree because it costs too much.", exj: "費用がかかりすぎるので反対です。" },
    { w: "reason", ja: "理由", ex: "My main reason is saving time.", exj: "私の主な理由は時間の節約です。" },
    { w: "option", ja: "選択肢", ex: "Choose the best option from A to D.", exj: "AからDの中で最も適切な選択肢を選びなさい。" },
    { w: "graph", ja: "グラフ", ex: "The graph shows sales from 2010 to 2020.", exj: "このグラフは2010年から2020年の売上を示しています。" },
    { w: "in contrast", ja: "対照的に", ex: "In contrast, costs stayed the same.", exj: "対照的に、コストは変わりませんでした。" },
    { w: "multiple choice", ja: "選択式（の）", ex: "This section is multiple choice.", exj: "このセクションは選択式です。" },
    { w: "fill in the blank", ja: "空欄補充", ex: "Fill in the blank with the correct word.", exj: "空欄に正しい単語を入れなさい。" },
    { w: "underline", ja: "下線を引く", ex: "Underline the main idea in each paragraph.", exj: "各段落の主旨に下線を引きなさい。" },
    { w: "summarize", ja: "要約する", ex: "Summarize the passage in one sentence.", exj: "本文を1文で要約しなさい。" },
    { w: "main idea", ja: "要旨", ex: "What is the main idea of this paragraph?", exj: "この段落の要旨は何ですか。" },
    { w: "supporting detail", ja: "裏付けとなる詳細", ex: "Find a supporting detail for this claim.", exj: "この主張を裏付ける詳細を見つけなさい。" },
    { w: "context clue", ja: "文脈手がかり", ex: "Use context clues to guess the meaning.", exj: "文脈の手がかりを使って意味を推測しなさい。" },
    { w: "vocabulary", ja: "語彙", ex: "This test focuses on academic vocabulary.", exj: "このテストはアカデミックな語彙に焦点を当てています。" },
    { w: "correct", ja: "正しい", ex: "Choose the correct answer from the choices.", exj: "選択肢の中から正しい答えを選びなさい。" },
    { w: "incorrect", ja: "誤った", ex: "Mark the incorrect statement.", exj: "誤った記述に印をつけなさい。" },
    { w: "score", ja: "得点", ex: "Your score will be shown after the test.", exj: "テストの後にあなたの得点が表示されます。" },
    { w: "essay question", ja: "記述式問題", ex: "The last section has one essay question.", exj: "最後のセクションには記述式問題が1つあります。" },
    { w: "time limit", ja: "制限時間", ex: "There is a 40-minute time limit for this section.", exj: "このセクションには40分の制限時間があります。" },
    { w: "instructions", ja: "指示", ex: "Read the instructions carefully before you start.", exj: "始める前に指示をよく読んでください。" },
    { w: "sample answer", ja: "解答例", ex: "Look at the sample answer for reference.", exj: "参考のために解答例を見てください。" },
    { w: "criteria", ja: "評価基準", ex: "Your essay will be graded on three criteria.", exj: "あなたのエッセイは3つの基準で評価されます。" },
    { w: "paraphrase", ja: "言い換える", ex: "Paraphrase the sentence without changing the meaning.", exj: "意味を変えずにその文を言い換えなさい。" },
    { w: "trend", ja: "傾向", ex: "Describe the trend shown in the graph.", exj: "グラフに示された傾向を説明しなさい。" },
    { w: "percentage", ja: "割合・パーセンテージ", ex: "What percentage of students passed the test?", exj: "何パーセントの生徒が試験に合格しましたか。" },
    { w: "overall", ja: "全体的に", ex: "Overall, the results support the hypothesis.", exj: "全体的に、結果は仮説を裏付けています。" },
    { w: "specific", ja: "具体的な", ex: "Give a specific example to support your answer.", exj: "答えを裏付ける具体的な例を挙げなさい。" },
    { w: "false", ja: "誤りの・偽の", ex: "Decide if each statement is true or false.", exj: "それぞれの記述が正しいか誤りか判断しなさい。" },
    { w: "valid point", ja: "妥当な指摘", ex: "That's a valid point, but there is a counterargument.", exj: "それは妥当な指摘ですが、反論もあります。" },
    { w: "counterargument", ja: "反論", ex: "A strong essay includes a counterargument.", exj: "優れたエッセイには反論が含まれます。" }
  ],
  daily: [
    { w: "hang out", ja: "遊ぶ・つるむ", ex: "Do you want to hang out this weekend?", exj: "今週末、遊ばない？" },
    { w: "catch up", ja: "近況を話す", ex: "Let's catch up over coffee soon.", exj: "近いうちにコーヒーでも飲みながら近況を話そう。" },
    { w: "invite", ja: "誘う・招待する", ex: "Thanks for inviting me to the party.", exj: "パーティーに誘ってくれてありがとう。" },
    { w: "favorite", ja: "お気に入りの", ex: "This is my favorite cafe in town.", exj: "ここが街で一番お気に入りのカフェなんだ。" },
    { w: "actually", ja: "実は", ex: "Actually, I've never seen that movie.", exj: "実は、その映画は見たことがないんだ。" },
    { w: "kind of", ja: "ちょっと・まあまあ", ex: "I'm kind of tired today.", exj: "今日はちょっと疲れてるんだ。" },
    { w: "be into", ja: "〜にハマっている", ex: "I'm really into baking these days.", exj: "最近、お菓子作りにすごくハマってるんだ。" },
    { w: "lately", ja: "最近", ex: "Have you seen any good shows lately?", exj: "最近、何かいい番組を見た？" },
    { w: "grab", ja: "さっと食べる・取る", ex: "Let's grab lunch before the movie.", exj: "映画の前にさっとランチを食べよう。" },
    { w: "look forward to", ja: "楽しみにする", ex: "I'm looking forward to seeing you!", exj: "会えるのを楽しみにしてるよ！" },
    { w: "awesome", ja: "最高の", ex: "That concert was awesome!", exj: "あのコンサートは最高だった！" },
    { w: "sounds good", ja: "いいね", ex: "Seven o'clock? Sounds good to me.", exj: "7時？いいね、大丈夫だよ。" },
    { w: "on me", ja: "私のおごりで", ex: "Dinner is on me tonight.", exj: "今夜の夕食は私のおごりね。" },
    { w: "make it", ja: "都合がつく・間に合う", ex: "Sorry, I can't make it on Friday.", exj: "ごめん、金曜は都合がつかないんだ。" },
    { w: "how about", ja: "〜はどう？", ex: "How about next Tuesday instead?", exj: "代わりに来週の火曜はどう？" },
    { w: "no worries", ja: "気にしないで", ex: "No worries, we can meet another day.", exj: "気にしないで、別の日に会えるよ。" },
    { w: "run errands", ja: "用事を済ませる", ex: "I need to run some errands this afternoon.", exj: "今日の午後、いくつか用事を済ませないと。" },
    { w: "chill", ja: "まったりする", ex: "Let's just chill at home tonight.", exj: "今夜は家でまったりしよう。" },
    { w: "text", ja: "メッセージを送る", ex: "I'll text you when I arrive.", exj: "着いたらメッセージを送るね。" },
    { w: "show up", ja: "現れる・来る", ex: "He showed up ten minutes late.", exj: "彼は10分遅れて現れた。" },
    { w: "figure out", ja: "解決する・理解する", ex: "Let me figure out the best way to get there.", exj: "そこへの一番いい行き方を考えてみるよ。" },
    { w: "get along", ja: "仲良くやる", ex: "We get along really well.", exj: "私たちはとても仲がいいです。" },
    { w: "drop by", ja: "ちょっと立ち寄る", ex: "Feel free to drop by anytime.", exj: "いつでも気軽に立ち寄ってね。" },
    { w: "take a break", ja: "休憩する", ex: "Let's take a break for ten minutes.", exj: "10分休憩しよう。" },
    { w: "give it a try", ja: "やってみる", ex: "I've never tried sushi, but I'll give it a try.", exj: "寿司は食べたことないけど、やってみるよ。" },
    { w: "run late", ja: "遅れる", ex: "Sorry, I'm running a bit late.", exj: "ごめん、ちょっと遅れそう。" },
    { w: "head out", ja: "出発する", ex: "We should head out soon to beat traffic.", exj: "渋滞を避けるためにそろそろ出発しよう。" },
    { w: "get together", ja: "集まる", ex: "Let's get together sometime next week.", exj: "来週のどこかで集まろうよ。" },
    { w: "by the way", ja: "ところで", ex: "By the way, did you finish that book?", exj: "ところで、あの本読み終わった？" },
    { w: "no big deal", ja: "大したことない", ex: "Don't worry, it's no big deal.", exj: "心配しないで、大したことじゃないよ。" },
    { w: "for sure", ja: "もちろん", ex: "Are you coming tonight? For sure!", exj: "今夜来る？もちろん！" },
    { w: "I'm down", ja: "賛成・乗り気", ex: "Pizza tonight? I'm down.", exj: "今夜ピザ？賛成！" },
    { w: "hang on", ja: "ちょっと待って", ex: "Hang on, let me check my calendar.", exj: "ちょっと待って、カレンダーを確認するね。" },
    { w: "never mind", ja: "気にしないで・なんでもない", ex: "Never mind, I found it already.", exj: "気にしないで、もう見つけたから。" },
    { w: "what's up", ja: "元気？・どうしたの", ex: "Hey, what's up? Long time no see.", exj: "やあ、元気？久しぶりだね。" },
    { w: "take it easy", ja: "気楽にやる", ex: "Take it easy this weekend, you deserve it.", exj: "今週末は気楽に過ごして、頑張ったからね。" },
    { w: "keep in touch", ja: "連絡を取り合う", ex: "Let's keep in touch after you move.", exj: "引っ越した後も連絡を取り合おうね。" },
    { w: "on the way", ja: "向かっている途中", ex: "I'm on the way, be there in five minutes.", exj: "今向かってるところ、5分で着くよ。" },
    { w: "plans", ja: "予定", ex: "Do you have any plans this weekend?", exj: "今週末、何か予定ある？" },
    { w: "count me in", ja: "参加する（乗り気で）", ex: "A movie night? Count me in!", exj: "映画の夜？参加するよ！" }
  ]
};

/* ---------- 日本語訳（模範解答 m / 読解パッセージ x / リスニング音声 s） ----------
   キーは taskPools 内の英文そのもの。英文を編集したらこちらも合わせて更新すること。
   （読み込み時に checkTranslations() が抜けを検出してコンソールに警告します） */

const translations = {
  /* travel */
  "Excuse me, could you tell me where the transfer gate is?": "すみません、乗り継ぎゲートはどこか教えていただけますか？",
  "Could I have the chicken sandwich and a coffee, please?": "チキンサンドとコーヒーをお願いできますか。",
  "Excuse me, how can I get to the station from here?": "すみません、ここから駅へはどう行けばいいですか？",
  "Hello, I have a reservation for tomorrow. Could we check in late, around 11 p.m.? We would also like a quiet room. Thank you.": "こんにちは。明日の予約をしている者です。23時ごろの遅いチェックインは可能でしょうか。静かな部屋もお願いしたいです。よろしくお願いします。",
  "Hello, I think I left my jacket in room 802 yesterday. Could you check and let me know? Thank you.": "こんにちは。昨日802号室にジャケットを忘れたようです。ご確認のうえ、ご連絡いただけますか。よろしくお願いします。",
  "Hi, could you book a taxi to the airport for 9 a.m. tomorrow? My room number is 502.": "こんにちは。明日の朝9時に空港行きのタクシーを手配していただけますか。部屋番号は502です。",
  "The 9:15 train to Boston is delayed by 20 minutes. Passengers for New York, please transfer at Central Station, platform 4.": "9時15分発ボストン行きの列車は20分遅れています。ニューヨーク方面のお客様は、セントラル駅の4番線でお乗り換えください。",
  "The train is delayed by 20 minutes, and I should transfer at Central Station on platform 4.": "列車は20分遅れていて、セントラル駅の4番線で乗り換える必要がある。",
  "Breakfast is served from 6:30 to 10:00 on the 2nd floor. The pool is closed on Mondays.": "朝食は2階で6時30分から10時まで提供されます。プールは月曜定休です。",
  "Breakfast is on the second floor from 6:30 to 10:00, and the pool is closed on Mondays.": "朝食は2階で6時30分から10時まで、プールは月曜が休みだ。",
  "Passengers with connecting flights should proceed to Gate B12. Please have your boarding pass ready.": "乗り継ぎ便のお客様はB12ゲートへお進みください。搭乗券をご用意ください。",
  "I should go to Gate B12 and have my boarding pass ready.": "B12ゲートに行って、搭乗券を用意しておくべきだ。",
  "Attention passengers. Flight 208 to Chicago is now boarding at gate 15.": "ご搭乗のお客様にお知らせします。シカゴ行き208便は、ただいま15番ゲートより搭乗を開始します。",
  "Welcome to City Hotel. Your room is on the fifth floor. Here is your key.": "シティホテルへようこそ。お部屋は5階です。こちらが鍵になります。",
  "The next stop is Central Station. Please change here for the airport line.": "次はセントラル駅です。空港線へお乗り換えの方はこちらでお降りください。",
  "My flight was canceled. Could you rebook me on the next available flight? I need to arrive by tomorrow morning.": "フライトが欠航になりました。次に空いている便に振り替えていただけますか。明日の朝までに到着する必要があります。",
  "I'm afraid the air conditioner in my room isn't working. Could you send someone to fix it, or move me to another room?": "恐れ入りますが、部屋のエアコンが動きません。修理の方を送っていただくか、別の部屋に移していただけますか。",
  "This is my first time here. What do you recommend seeing if I only have one day?": "ここに来るのは初めてです。1日しかない場合、何を見るのがおすすめですか？",
  "Hello, my tour on May 3 was canceled due to the weather. Could you tell me how to get a refund? My booking number is 5024. Thank you.": "こんにちは。5月3日のツアーが悪天候のため中止になりました。返金の方法を教えていただけますか。予約番号は5024です。よろしくお願いします。",
  "Hi, we will arrive around 10 p.m. Is late check-in possible? Also, is there parking near the apartment?": "こんにちは。到着は22時ごろになります。レイトチェックインは可能でしょうか。また、アパートの近くに駐車場はありますか。",
  "The location was perfect and the staff were friendly. However, the room was smaller than the photos. Overall, I would stay here again.": "立地は完璧で、スタッフも親切でした。ただ、部屋は写真より狭かったです。全体としては、また泊まりたいと思います。",
  "Due to a strike, all trains on the Blue Line are suspended this weekend. Replacement buses run every 30 minutes from the main square, but expect delays of up to one hour.": "ストライキのため、今週末はブルーラインの全列車が運休します。代替バスがメイン広場から30分ごとに運行しますが、最大1時間の遅れが見込まれます。",
  "Trains on the Blue Line are suspended, so I should take a replacement bus from the main square and allow up to an extra hour.": "ブルーラインは運休なので、メイン広場から代替バスに乗り、最大1時間の余裕を見ておくべきだ。",
  "This policy covers medical costs up to $50,000 but does not cover lost baggage unless it was checked in.": "この保険は最大5万ドルまでの医療費を補償しますが、預け入れた場合を除き、手荷物の紛失は補償されません。",
  "Medical costs are covered up to $50,000, but lost baggage is only covered if it was checked in.": "医療費は5万ドルまで補償されるが、荷物の紛失は預け入れた場合のみ補償される。",
  "Visitors may claim a tax refund on purchases over $100 made at participating stores. Keep your receipts and show them at the airport counter before check-in.": "旅行者は、対象店舗での100ドルを超える購入について免税を申請できます。レシートを保管し、チェックイン前に空港カウンターで提示してください。",
  "I can get a tax refund on purchases over $100 if I keep my receipts and show them at the airport before check-in.": "レシートを保管してチェックイン前に空港で提示すれば、100ドルを超える買い物は免税を受けられる。",
  "Ladies and gentlemen, due to heavy traffic, this bus will take a different route. If you need City Museum, please get off at the next stop.": "皆様、渋滞のため、このバスは別のルートを通ります。市立博物館へお越しの方は、次の停留所でお降りください。",
  "Your room upgrade is confirmed. Breakfast and pool access are included at no extra charge.": "お部屋のアップグレードが確定しました。朝食とプールのご利用が追加料金なしで含まれます。",
  "The last train to the airport leaves at eleven forty from platform two. Please do not miss it.": "空港行きの最終列車は11時40分に2番線から発車します。乗り遅れないようご注意ください。",

  /* business */
  "Just to confirm, the deadline is Friday, right? Who is in charge of the report?": "確認ですが、締切は金曜日で合っていますか。レポートの担当は誰でしょうか。",
  "Hello, I'm Ken from the sales team. I'm in charge of the Tokyo area. Nice to meet you.": "こんにちは、営業チームのケンです。東京エリアを担当しています。よろしくお願いします。",
  "Sorry, could you say that again more slowly? I want to make sure I understand.": "すみません、もう一度ゆっくり言っていただけますか。きちんと理解したいので。",
  "Hello, I'm afraid I can't join tomorrow's meeting because of a client visit. Could you share the notes later? Thank you.": "こんにちは。恐れ入りますが、クライアント訪問のため明日の会議に参加できません。後ほど議事録を共有していただけますか。よろしくお願いします。",
  "Hi, please find the sales report attached. Let me know if you have any questions.": "こんにちは。売上レポートを添付いたします。ご不明な点があればお知らせください。",
  "Thank you for your email. How about Tuesday at 2 p.m.? If that doesn't work, I'm also free on Thursday morning.": "メールありがとうございます。火曜日の14時はいかがでしょうか。ご都合が合わなければ、木曜の午前も空いています。",
  "Team, the client moved our demo from May 10 to May 8. Please finish the slides by May 6 and send them to Anna for review.": "チームの皆さんへ。クライアントがデモを5月10日から5月8日に変更しました。スライドを5月6日までに仕上げ、レビューのためアンナに送ってください。",
  "The demo is now on May 8, so the slides are due May 6 and should go to Anna.": "デモは5月8日になったので、スライドは5月6日締切で、アンナに送る必要がある。",
  "Starting next month, all expense reports must be submitted online by the 25th. Paper forms will no longer be accepted.": "来月から、すべての経費報告書は25日までにオンラインで提出する必要があります。紙の用紙は今後受け付けられません。",
  "From next month, expense reports must be submitted online by the 25th, and paper forms won't be accepted.": "来月から経費報告書は25日までにオンライン提出が必要で、紙の用紙は受け付けられない。",
  "The office will be closed on Friday for maintenance. Please work from home and keep Slack open during business hours.": "金曜日はメンテナンスのためオフィスが閉鎖されます。在宅勤務とし、業務時間中はSlackを開いておいてください。",
  "The office is closed on Friday, so we should work from home and stay available on Slack.": "金曜はオフィスが閉まるので、在宅勤務してSlackで連絡が取れるようにしておくべきだ。",
  "Let's start the meeting. First, a quick update on the schedule. The release date moves to next Wednesday.": "会議を始めましょう。まず、スケジュールについて簡単な更新です。リリース日は来週水曜に移ります。",
  "Can everyone see my screen? Today I want to talk about the budget for the next quarter.": "皆さん、私の画面が見えていますか。今日は次の四半期の予算についてお話ししたいと思います。",
  "Thanks everyone. To sum up, John will contact the client, and we will meet again on Friday.": "皆さんありがとうございます。まとめると、ジョンがクライアントに連絡し、金曜にまた集まります。",
  "I see your point, but I'm concerned about the cost. Could we compare two options before deciding?": "おっしゃることは分かりますが、コストが気になります。決める前に2つの案を比較できませんか。",
  "I'd like to suggest moving the launch to June. That would give us two more weeks for testing.": "ローンチを6月に延ばすことを提案したいです。そうすればテスト期間が2週間増えます。",
  "We're on track overall. Development is 80 percent done, but testing is slightly behind because of a staffing issue.": "全体としては順調です。開発は80%完了していますが、人員の問題でテストが少し遅れています。",
  "Hi all, here is a summary of today's meeting. Decided: we will launch on June 1. Open: pricing for the premium plan. Next steps: Ken will draft the press release by Friday.": "皆さん、本日の会議のまとめです。決定事項：6月1日にローンチします。未決事項：プレミアムプランの価格。次のアクション：ケンが金曜までにプレスリリース案を作成します。",
  "I hope you're doing well. I'm writing to follow up on the contract I sent last week. Could you let me know the status when you have a moment?": "お元気でお過ごしでしょうか。先週お送りした契約書の件でご連絡しました。お手すきの際に状況をお知らせいただけますか。",
  "Thank you for the proposal. After careful consideration, we have decided not to move forward this time. We appreciate your effort and hope to work together in the future.": "ご提案ありがとうございます。慎重に検討した結果、今回は見送らせていただくことになりました。ご尽力に感謝しており、今後ご一緒できることを願っております。",
  "The new vendor offers a 15% discount for annual contracts, but the cancellation fee is high: 50% of the remaining balance. Legal suggests a 6-month pilot before committing.": "新しいベンダーは年間契約で15%の割引を提供していますが、解約料が高く、残額の50%です。法務は本契約の前に6ヶ月の試験導入を提案しています。",
  "The discount is attractive, but the cancellation fee is risky, so a 6-month pilot is the safer option.": "割引は魅力的だが解約料がリスクなので、6ヶ月の試験導入の方が安全な選択だ。",
  "Q2 revenue grew 8% year over year, driven by the enterprise segment. However, churn in the small-business segment rose to 6%, which may offset gains next quarter.": "第2四半期の売上は法人部門に牽引され、前年比8%増でした。しかし、中小企業部門の解約率が6%に上昇し、次の四半期の伸びを相殺する可能性があります。",
  "Revenue grew 8% thanks to enterprise, but rising small-business churn could offset that next quarter.": "法人部門のおかげで売上は8%伸びたが、中小企業の解約増加が次の四半期にそれを相殺しうる。",
  "Following the security audit, all staff must enable two-factor authentication by March 15. Accounts without it will be suspended until IT confirms compliance.": "セキュリティ監査を受け、全社員は3月15日までに二要素認証を有効にする必要があります。未設定のアカウントは、IT部門が対応を確認するまで停止されます。",
  "Everyone must enable two-factor authentication by March 15 or their accounts will be suspended.": "全員が3月15日までに二要素認証を有効にしなければ、アカウントが停止される。",
  "Before we close, one concern. If we cut the testing phase, support tickets may increase. I suggest we keep the original schedule.": "終わる前に一つ懸念があります。テスト期間を削ると、サポートへの問い合わせが増えるかもしれません。当初のスケジュールを維持することを提案します。",
  "The client asked for a discount. I proposed extending the contract to two years instead of lowering the price.": "クライアントから値引きの要望がありました。価格を下げる代わりに、契約を2年に延長することを提案しました。",
  "Quick update. Hiring is frozen until next quarter, so please plan the roadmap with the current team size.": "簡単な更新です。採用は次の四半期まで凍結なので、現在のチーム規模でロードマップを計画してください。",

  /* study */
  "Excuse me, professor. Could you explain the assignment again? I'm not sure about the deadline.": "すみません、先生。課題についてもう一度説明していただけますか。締切がはっきり分かっていません。",
  "Hi, are you also in Professor Lee's class? Could I borrow your notes from Monday?": "こんにちは、あなたもリー先生の授業を取っていますか。月曜のノートを貸してもらえませんか。",
  "Excuse me, I'm looking for this book. Could you tell me where I can find it?": "すみません、この本を探しています。どこにあるか教えていただけますか。",
  "Dear Professor Lee, I'm sorry, but I was sick and missed today's class. Could you tell me what I should read for next week? Thank you.": "リー先生、申し訳ありません。体調不良で本日の授業を欠席しました。来週までに読むべきものを教えていただけますか。よろしくお願いします。",
  "I think online classes are useful because we can save time. However, it is hard to ask questions. So I prefer a mix of both.": "オンライン授業は時間を節約できるので便利だと思います。しかし、質問がしにくいです。なので、両方を組み合わせるのが好みです。",
  "Hi everyone, I'm new to this course. I'm interested in joining a study group. Is anyone meeting this week?": "皆さんこんにちは。このコースは初めてです。勉強会に参加したいと思っています。今週集まる人はいますか。",
  "The essay is due on Friday at 5 p.m. It should be 500 words and include at least two sources. Late work loses 10% per day.": "エッセイの締切は金曜午後5時です。500語で、少なくとも2つの出典を含める必要があります。提出が遅れると1日につき10%減点されます。",
  "The 500-word essay with two sources is due Friday at 5 p.m., and late work loses 10% per day.": "出典2つ入りの500語エッセイは金曜午後5時締切で、遅れると1日10%減点される。",
  "Chapter 3 argues that habits form through repetition and reward. The author gives the example of morning exercise becoming automatic after 60 days.": "第3章は、習慣は反復と報酬によって形成されると論じています。著者は、朝の運動が60日後には自動的になる例を挙げています。",
  "The chapter says habits form through repetition and reward, like exercise becoming automatic after 60 days.": "この章は、60日後に運動が自動的になるように、習慣は反復と報酬で形成されると述べている。",
  "Office hours are Tuesdays 2-4 p.m. Book a slot online. For quick questions, use the course forum, where TAs reply within 24 hours.": "オフィスアワーは火曜の午後2時から4時です。オンラインで枠を予約してください。簡単な質問はコースの掲示板をご利用ください。TAが24時間以内に返信します。",
  "I can book office hours on Tuesdays or ask quick questions on the forum, where TAs reply within a day.": "火曜のオフィスアワーを予約するか、掲示板で簡単な質問ができ、TAが1日以内に返信してくれる。",
  "Today we will cover chapter five. Before that, please hand in your homework from last week.": "今日は第5章を扱います。その前に、先週の宿題を提出してください。",
  "Remember, the quiz on Friday covers everything up to page ninety. Bring a pencil and your student ID.": "金曜の小テストは90ページまでが範囲であることを覚えておいてください。鉛筆と学生証を持参してください。",
  "For the group project, you will work in teams of four. Choose your topic by next Monday.": "グループ課題では、4人1組で取り組みます。来週月曜までにテーマを決めてください。",
  "That's an interesting point. However, the data in the article suggests the opposite. Could we look at figure two together?": "興味深い指摘ですね。ただ、記事のデータは逆のことを示しています。図2を一緒に見てみませんか。",
  "Today I'm going to talk about renewable energy. First, I'll explain the background. Then I'll compare two solutions and give my recommendation.": "今日は再生可能エネルギーについてお話しします。まず背景を説明します。次に2つの解決策を比較し、私の提言を述べます。",
  "Could you clarify how the final grade is calculated? Specifically, how much does class participation count?": "最終成績がどのように算出されるか教えていただけますか。特に、授業参加はどれくらいの割合を占めますか。",
  "While online learning offers flexibility and lower costs, it requires strong self-discipline. Students who lack structure often fall behind. Therefore, universities should combine online content with regular in-person sessions.": "オンライン学習は柔軟性と低コストをもたらす一方で、強い自己管理を必要とします。枠組みのない学生はしばしば遅れをとります。したがって、大学はオンライン教材と定期的な対面授業を組み合わせるべきです。",
  "Dear Professor, I'm writing my paper on language learning apps. Would you have time this week to discuss my outline? I have attached a draft.": "先生、私は語学学習アプリについて論文を書いています。今週、構成案について相談するお時間はありますか。下書きを添付しました。",
  "Studying abroad will help me bridge my engineering background with global experience. My goal is to develop affordable water filters, and this program offers the exact lab experience I need.": "留学は、私の工学の素地と国際経験を結びつける助けになります。私の目標は安価な浄水フィルターを開発することで、このプログラムはまさに私が必要とする研究室での経験を提供してくれます。",
  "The study followed 2,000 students over three years. Those who slept fewer than six hours scored 12% lower on average. However, the authors note that stress, not sleep alone, may explain part of the gap.": "この研究は3年間にわたり2,000人の学生を追跡しました。睡眠が6時間未満の学生は平均で12%低いスコアでした。ただし著者らは、睡眠だけでなくストレスがその差の一部を説明しうると述べています。",
  "Students sleeping under six hours scored 12% lower, but stress may explain part of the difference.": "睡眠6時間未満の学生はスコアが12%低かったが、その差の一部はストレスで説明できるかもしれない。",
  "Critics argue the theory ignores cultural context. Supporters respond that its core claims have been replicated in over 30 countries, though effect sizes vary widely.": "批判者は、この理論が文化的文脈を無視していると主張します。擁護者は、効果の大きさには幅があるものの、中核的な主張は30ヶ国以上で再現されていると反論します。",
  "Critics say it ignores culture, while supporters point to replications in 30 countries with varying effect sizes.": "批判者は文化を無視していると言い、擁護者は効果の大きさに差はあるが30ヶ国での再現を挙げている。",
  "Enrollment in humanities has fallen 25% in a decade. The dean proposes joint degrees with computer science, arguing that employers value writing plus technical skills.": "人文系の在籍者数は10年で25%減少しました。学部長は、雇用主が文章力と技術スキルの両方を評価するとして、コンピュータサイエンスとの共同学位を提案しています。",
  "Humanities enrollment fell 25%, so the dean proposes joint degrees with computer science to add technical skills.": "人文系の在籍者が25%減ったため、学部長は技術スキルを加える共同学位を提案している。",
  "There are three main causes of the revolution. Economic pressure, new ideas, and a weak government. Let's start with the economy.": "革命には3つの主な原因があります。経済的圧力、新しい思想、そして弱い政府です。まず経済から始めましょう。",
  "Your midterm will be an open-book essay. You will have two hours, and you must cite at least three readings from class.": "中間試験は持ち込み可のエッセイ形式です。時間は2時間で、授業の課題文献を少なくとも3つ引用する必要があります。",
  "Next week's seminar is canceled. Instead, please watch the recorded lecture and post one question to the forum by Thursday.": "来週のセミナーは中止です。代わりに録画講義を視聴し、木曜までに掲示板に質問を1つ投稿してください。",

  /* exam */
  "My name is Yuki. I work at a small IT company. In my free time, I enjoy running and cooking. Recently I started studying English to travel abroad.": "私の名前はユキです。小さなIT企業で働いています。自由な時間にはランニングと料理を楽しみます。最近、海外旅行のために英語の勉強を始めました。",
  "In this picture, a woman is ordering coffee at a cafe. There are two people waiting behind her. It looks like a busy morning.": "この写真では、女性がカフェでコーヒーを注文しています。彼女の後ろには2人が待っています。忙しい朝のようです。",
  "I prefer studying in the morning because my mind is fresh. For example, I remember words better before breakfast.": "頭がすっきりしているので、朝に勉強する方が好きです。例えば、朝食前の方が単語をよく覚えられます。",
  "I agree that remote work improves productivity. First, workers save commuting time. Second, they can focus better without office noise. Therefore, companies should allow it.": "リモートワークが生産性を高めるという意見に賛成です。第一に、通勤時間を節約できます。第二に、オフィスの騒音がなく、より集中できます。したがって、企業はこれを認めるべきです。",
  "The graph shows that sales increased from January to June. The biggest rise was in April. In contrast, costs stayed almost the same.": "グラフは、売上が1月から6月にかけて増加したことを示しています。最も大きな伸びは4月でした。対照的に、コストはほぼ横ばいでした。",
  "Dear Mr. Smith, thank you for your invitation. I would be happy to attend the workshop on Saturday. Could you tell me what I should bring?": "スミス様、ご招待ありがとうございます。土曜日のワークショップに喜んで参加させていただきます。持参すべきものを教えていただけますか。",
  "The city library will move to a new building in September. During August, all books must be returned, and online services will pause for two weeks.": "市立図書館は9月に新しい建物へ移転します。8月中にすべての本を返却する必要があり、オンラインサービスは2週間停止します。",
  "The library moves in September, books are due back in August, and online services stop for two weeks.": "図書館は9月に移転し、本は8月に返却期限、オンラインサービスは2週間停止する。",
  "To register for the exam, create an account, upload a photo, and pay the fee by June 1. Late registration costs an extra $30.": "試験に申し込むには、アカウントを作成し、写真をアップロードし、6月1日までに受験料を支払ってください。遅れての申し込みは追加で30ドルかかります。",
  "I must register and pay by June 1, or pay an extra $30 for late registration.": "6月1日までに登録して支払う必要があり、遅れると追加で30ドルかかる。",
  "The manager was reluctant to approve the budget, asking for more data twice before finally agreeing.": "その管理職は予算の承認に消極的で、最終的に同意する前に2度もデータの追加を求めました。",
  "Reluctant means unwilling or hesitant to do something.": "reluctant は「気が進まない」「ためらっている」という意味です。",
  "Question one. Where does the conversation probably take place? Listen carefully to words like menu, order, and bill.": "問題1。この会話はおそらくどこで行われていますか。menu、order、bill といった語に注意して聞いてください。",
  "The man wants to change his appointment from Tuesday to Thursday afternoon.": "その男性は、予約を火曜から木曜の午後に変更したいと思っています。",
  "Attention shoppers. All winter items are thirty percent off until Sunday.": "ご来店のお客様にお知らせします。冬物商品はすべて日曜まで30%オフです。",
  "Some people think students should wear uniforms. I disagree for two reasons. First, clothes are a form of self-expression. Second, uniforms are expensive for families. That's why I support free dress.": "学生は制服を着るべきだと考える人もいます。私は2つの理由で反対です。第一に、服装は自己表現の一つの形です。第二に、制服は家庭にとって高額です。だから私は私服に賛成します。",
  "The lecture explained why cities are getting hotter. The professor gave two examples: dark surfaces that absorb heat and fewer trees. This supports the reading's main claim.": "講義は、なぜ都市が暑くなっているのかを説明しました。教授は2つの例を挙げました。熱を吸収する暗い路面と、木の減少です。これは読解文の主要な主張を裏づけています。",
  "If I had to choose, I would take the internship rather than the summer course, because practical experience matters more in my field.": "選ばなければならないなら、夏期講習よりインターンを選びます。私の分野では実務経験の方が重要だからです。",
  "Although online shopping is convenient, it weakens local stores. Governments should support small businesses through lower taxes, because lively shopping streets make cities safer and more attractive.": "オンラインショッピングは便利ですが、地元の商店を弱体化させます。活気ある商店街は街をより安全で魅力的にするため、政府は減税を通じて小規模事業者を支援すべきです。",
  "The reading claims electric cars will dominate by 2035. However, the lecture points out battery shortages and weak charging networks, which cast doubt on that timeline.": "読解文は、2035年までに電気自動車が主流になると主張しています。しかし講義は、電池不足と充電網の弱さを指摘しており、その時期に疑問を投げかけています。",
  "The chart compares energy sources in 2000 and 2020. Coal fell sharply from 45% to 20%, while renewables tripled. Gas remained stable at around 25%.": "この図は2000年と2020年のエネルギー源を比較しています。石炭は45%から20%へ急減し、一方で再生可能エネルギーは3倍になりました。ガスは25%前後で安定していました。",
  "Paragraph 2 contradicts the common belief that multitasking saves time. In experiments, switching tasks added up to 40% more completion time, especially for complex work.": "第2段落は、マルチタスクが時間を節約するという通説に反論しています。実験では、タスクを切り替えることで、特に複雑な作業において完了までの時間が最大40%増加しました。",
  "Multitasking actually wastes time; switching added up to 40% more time on complex tasks.": "マルチタスクは実際には時間を無駄にする。複雑な作業では、切り替えによって最大40%時間が増えた。",
  "While the author concedes that tourism brings revenue, she maintains that unregulated growth damages the very sites tourists come to see, citing Venice as a cautionary tale.": "著者は観光が収益をもたらすことを認めつつ、規制のない成長が観光客の見に来るまさにその場所を損なうと主張し、ベネチアを戒めの例として挙げています。",
  "The author admits tourism earns money but argues unregulated growth destroys the attractions, using Venice as an example.": "著者は観光が収益を生むと認めつつ、規制なき成長が観光地を壊すと論じ、ベネチアを例に挙げている。",
  "The correlation between coffee and longevity disappeared once researchers controlled for income and exercise, suggesting earlier studies confused cause and effect.": "コーヒーと長寿の相関は、研究者が収入と運動の影響を調整すると消失し、初期の研究が因果関係を取り違えていたことを示唆しています。",
  "After controlling for income and exercise, the coffee-longevity link vanished, so earlier studies likely mixed up cause and effect.": "収入と運動を調整すると、コーヒーと長寿の関連は消えたので、初期の研究は因果を取り違えていた可能性が高い。",
  "The speaker argues that paper books will survive, mainly because readers remember more when they turn physical pages.": "話者は、読者が実際にページをめくる方がより多く記憶するという理由から、紙の本は生き残ると主張しています。",
  "According to the study, people who wrote down three goals each morning finished twenty percent more tasks by Friday.": "その研究によると、毎朝3つの目標を書き出した人は、金曜までに20%多くのタスクを終えました。",
  "The professor disagrees with the textbook. She says the data is too old and the sample was too small to draw conclusions.": "教授は教科書に反対しています。データが古すぎ、標本が小さすぎて結論を出せないと述べています。",

  /* daily */
  "What are you doing this weekend? I'm thinking of trying that new ramen place.": "今週末は何をするの？私はあの新しいラーメン屋に行ってみようと思ってるんだ。",
  "Oh really? That sounds fun! How was the weather there?": "へえ、そうなんだ！楽しそう！向こうの天気はどうだった？",
  "I've been busy with work lately, but I started jogging on Sundays. It feels great.": "最近は仕事が忙しいんだけど、日曜にジョギングを始めたんだ。すごく気持ちいいよ。",
  "Sorry, I can't make it on Friday. How about next Tuesday instead? I'd love to catch up.": "ごめん、金曜は都合がつかないんだ。代わりに来週の火曜はどう？ぜひ近況を話したいな。",
  "Thank you so much for dinner last night! The pasta was amazing. Next time it's on me.": "昨夜は夕食を本当にありがとう！パスタが最高だった。次は私のおごりね。",
  "Do you want to see a movie this Saturday? There's a new action film at 7. We could grab dinner after.": "今週の土曜、映画を見に行かない？7時に新しいアクション映画があるんだ。その後に夕食を食べてもいいね。",
  "Finally finished my first 10K run! My legs are dead but I'm so proud. Next goal: half marathon in October.": "ついに初めての10kmランを完走！脚はもうボロボロだけど、すごく誇らしい。次の目標は10月のハーフマラソン。",
  "They finished their first 10K, feel proud though tired, and now aim for a half marathon in October.": "初めての10kmを完走し、疲れているが誇らしく感じていて、次は10月のハーフマラソンを目指している。",
  "Hey, party's moved to Sam's place, same time. Bring something to drink. Oh, and it's a surprise, so don't text Alex!": "ねえ、パーティーはサムの家に変更、時間は同じ。飲み物を何か持ってきて。あ、サプライズだからアレックスには連絡しないでね！",
  "The party is now at Sam's place at the same time; bring drinks and keep it secret from Alex.": "パーティーは同じ時間でサムの家に変更。飲み物を持参し、アレックスには秘密にする。",
  "New cafe alert: great flat white, quiet upstairs seating, free wifi. A bit pricey though. Perfect for remote work days.": "新しいカフェ情報：フラットホワイトが美味しく、2階は静かな席、無料wifi付き。ちょっと高めだけどね。リモートワークの日にぴったり。",
  "The new cafe has good coffee, quiet seats, and wifi, but it's a little expensive.": "その新しいカフェはコーヒーが美味しく、静かな席とwifiがあるが、少し高い。",
  "Hey, sorry I'm late. The train stopped for ten minutes. Did you order already?": "ごめん、遅れちゃった。電車が10分止まってたんだ。もう注文した？",
  "I'm planning a small barbecue on Saturday. Can you bring some drinks? Around three o'clock.": "土曜にちょっとしたバーベキューを計画してるんだ。飲み物を持ってきてくれる？3時ごろだよ。",
  "Guess what? I got two tickets for the concert. Are you free next Friday night?": "聞いて！コンサートのチケットを2枚手に入れたんだ。来週の金曜の夜は空いてる？",
  "I've been watching that new drama everyone talks about. Honestly, the first season was better, but I'm still hooked.": "みんなが話題にしてるあの新しいドラマを見てるんだ。正直、1期の方が良かったけど、それでもハマってる。",
  "That sounds tough. Have you thought about talking to your manager directly? Whatever you decide, I'm on your side.": "それは大変だね。上司に直接話すことは考えた？どんな決断をしても、私はあなたの味方だよ。",
  "That trip was unforgettable. We got completely lost, ended up at a tiny local festival, and it turned out to be the best night.": "あの旅行は忘れられないよ。完全に道に迷って、小さな地元のお祭りにたどり着いて、結局それが最高の夜になったんだ。",
  "It's been ages! Work has been hectic since the promotion, but I finally took a week off in Okinawa. How's the new apartment? Let's have a video call soon.": "久しぶり！昇進してから仕事がバタバタだったけど、やっと沖縄で1週間休みを取ったよ。新しいアパートはどう？近いうちにビデオ通話しよう。",
  "I really appreciate the invite, but I have a family thing that day. Could we do brunch on Sunday instead? My treat.": "誘ってくれて本当に嬉しいんだけど、その日は家族の用事があるんだ。代わりに日曜のブランチはどう？私のおごりで。",
  "If you liked that book, you should try Deep Work. It changed how I plan my mornings. I'll lend you my copy next time we meet.": "あの本が気に入ったなら、『Deep Work』を読んでみるといいよ。朝の過ごし方の計画が変わったんだ。次に会うとき私の本を貸すね。",
  "Not gonna lie, moving abroad alone was terrifying at first. Three months in, I finally have a routine: morning market, work, evening runs by the river. Homesick? Sometimes. Regrets? Zero.": "正直に言うと、一人で海外に移り住むのは最初は怖かった。3ヶ月経って、やっと生活のリズムができた。朝は市場、仕事、夕方は川沿いをランニング。ホームシック？たまにね。後悔？ゼロ。",
  "They were scared about moving abroad, but after three months they have a routine, sometimes miss home, and have no regrets.": "海外移住が怖かったが、3ヶ月後には生活のリズムができ、たまに故郷が恋しくなるものの、後悔はない。",
  "PSA for the group: the hiking trail we planned is closed after last week's storm. Plan B is the coastal path. Slightly longer but the views are unreal. Meet at 8 sharp.": "グループへのお知らせ：先週の嵐で、予定していたハイキングコースが閉鎖になりました。プランBは海岸沿いの道です。少し長いけど景色が最高。8時ちょうどに集合。",
  "The original trail is closed, so the group will take the longer coastal path, meeting at 8.": "元のコースは閉鎖なので、グループはより長い海岸沿いの道を行き、8時に集合する。",
  "Hot take: brunch is overrated. You wait an hour for eggs you could make at home. Give me a quiet morning coffee and a good bakery any day.": "あえて言うけど、ブランチは過大評価だと思う。家で作れる卵料理のために1時間も待つなんて。それより静かな朝のコーヒーといいパン屋の方がいい。",
  "They think brunch is overrated because of the wait, preferring coffee and a bakery instead.": "待ち時間を理由にブランチは過大評価だと考えており、代わりにコーヒーとパン屋を好んでいる。",
  "So the movie was sold out, and we ended up at a jazz bar next door. Best accident ever. You have to come next time.": "それで映画が満席で、結局隣のジャズバーに行ったんだ。最高の偶然だったよ。次は絶対一緒に行こう。",
  "My sister is thinking about quitting her job to study design. I told her to build some savings first, just in case.": "妹がデザインを勉強するために仕事を辞めようか考えてるんだ。念のため、まず貯金をしておくよう言ったよ。",
  "Long story short, the landlord finally fixed the heater, but now the kitchen tap is leaking. This apartment keeps me busy.": "手短に言うと、大家さんがやっとヒーターを直してくれたんだけど、今度はキッチンの蛇口が水漏れしてる。このアパートには手を焼くよ。"
};

/* 翻訳の抜けを開発時に検出する（本番でも害はないので常時実行） */
function checkTranslations() {
  const missing = [];
  Object.entries(taskPools).forEach(([goal, tiers]) => {
    Object.entries(tiers).forEach(([tierName, skills]) => {
      Object.entries(skills).forEach(([skill, tasks]) => {
        tasks.forEach((task) => {
          ["m", "x", "s"].forEach((field) => {
            if (task[field] && !translations[task[field]]) {
              missing.push(`${goal}.${tierName}.${skill}: ${field} = ${task[field].slice(0, 40)}…`);
            }
          });
        });
      });
    });
  });
  Object.entries(vocabDecks).forEach(([goal, deck]) => {
    deck.forEach((word) => {
      if (!word.exj) missing.push(`vocab ${goal}: exj がありません（${word.w}）`);
    });
  });
  if (missing.length > 0) console.warn(`[5minEnglish] 日本語訳が未登録の英文が ${missing.length} 件あります`, missing);
  return missing;
}

/* ---------- バッジ ---------- */

const badgeDefs = [
  { id: "first-task", emoji: "🎯", name: "はじめの一歩", desc: "最初の課題をクリア" },
  { id: "vocab-10", emoji: "📚", name: "ことばコレクター", desc: "単語を10語学習" },
  { id: "vocab-50", emoji: "🏆", name: "50語マスター", desc: "単語を50語学習" },
  { id: "streak-3", emoji: "🔥", name: "3日の炎", desc: "3日連続で学習" },
  { id: "streak-7", emoji: "⚡", name: "1週間の雷", desc: "7日連続で学習" },
  { id: "perfect-day", emoji: "🌟", name: "パーフェクトデー", desc: "1日で5メニュー制覇" },
  { id: "listener", emoji: "🎧", name: "ひらいた耳", desc: "ディクテーションで★3" },
  { id: "speaker", emoji: "🎙", name: "声に出した", desc: "音声入力で課題クリア" },
  { id: "rediagnosis", emoji: "📈", name: "成長チェッカー", desc: "再診断を実施" },
  { id: "level-up", emoji: "🚀", name: "レベルアップ", desc: "診断でレベルが上昇" }
];

/* ---------- 日付ユーティリティ（すべてローカル時刻基準） ---------- */

function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function keyToDate(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function shiftKey(key, deltaDays) {
  const date = keyToDate(key);
  date.setDate(date.getDate() + deltaDays);
  return dateKey(date);
}

function dayNumber(key) {
  return Math.round(keyToDate(key).getTime() / 86400000);
}

const todayKey = dateKey();

/* ---------- 状態管理（v2スキーマ + 旧データ移行） ---------- */

const defaultState = () => ({
  version: 2,
  goal: null,
  level: null,
  xp: 0,
  skillXp: { vocab: 0, speaking: 0, writing: 0, reading: 0, listening: 0 },
  doneDays: [],
  dayLog: {},          // { "2026-07-20": { units: ["vocab", ...] } }
  vocab: {},           // { "travel:delay": { box, due, seen } }
  wordsSeen: 0,
  history: [],         // { d, skill, task, answer, stars }
  badges: [],
  diagnoses: [],       // { d, score, level }
  settings: { weeklyGoal: 5, reminderTime: "21:00" }
});

function loadState() {
  let raw;
  try {
    raw = JSON.parse(localStorage.getItem("fluentPathState") || "{}");
  } catch {
    raw = {};
  }
  if (raw.version === 2) {
    return Object.assign(defaultState(), raw, {
      skillXp: Object.assign(defaultState().skillXp, raw.skillXp || {}),
      settings: Object.assign(defaultState().settings, raw.settings || {})
    });
  }
  // v1からの移行: XP・目的・記録日は引き継ぐ。レベルは再診断で決め直す。
  const next = defaultState();
  if (raw.goal && goalMeta[raw.goal]) next.goal = raw.goal;
  if (levels.includes(raw.level)) next.level = raw.level;
  if (Number.isFinite(raw.xp)) next.xp = Math.max(0, raw.xp);
  if (Array.isArray(raw.doneDays)) next.doneDays = raw.doneDays.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));
  return next;
}

let state = loadState();

function saveState() {
  localStorage.setItem("fluentPathState", JSON.stringify(state));
  window.FluentCloud?.scheduleSync(state);
}

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

/* ---------- レベル / 難度 ---------- */

function getLevel(score) {
  if (score <= 3) return "A1";
  if (score <= 6) return "A2";
  if (score <= 9) return "B1";
  if (score <= 12) return "B2";
  if (score <= 14) return "C1";
  return "C2";
}

function levelIndex() {
  return Math.max(0, levels.indexOf(state.level || "A1"));
}

function tier() {
  return levelIndex() <= 1 ? "basic" : "plus";
}

function levelDescriptions(level) {
  return {
    A1: "定型文で反応",
    A2: "身近な話題",
    B1: "要点を説明",
    B2: "議論に参加",
    C1: "精密に表現",
    C2: "自在に運用"
  }[level];
}

/* ---------- 今日の課題（日替わりローテーション） ---------- */

function currentPool() {
  return taskPools[state.goal || "travel"][tier()];
}

function todaysTask(skill) {
  const pool = currentPool()[skill];
  return pool[dayNumber(todayKey) % pool.length];
}

function todayLog() {
  if (!state.dayLog[todayKey]) state.dayLog[todayKey] = { units: [] };
  return state.dayLog[todayKey];
}

function unitDone(unit) {
  return (state.dayLog[todayKey]?.units || []).includes(unit);
}

/* ---------- ストリーク（おまもり: 月1回の欠席を許容） ---------- */

function calculateStreak(days) {
  const set = new Set(days);
  const freezeUsedMonths = new Set();
  let streak = 0;
  let key = todayKey;
  if (!set.has(key)) key = shiftKey(key, -1); // 今日まだ学習していなくても昨日までの記録は生きている
  let usedFreeze = false;
  while (true) {
    if (set.has(key)) {
      streak += 1;
      key = shiftKey(key, -1);
      continue;
    }
    const month = key.slice(0, 7);
    if (streak > 0 && !freezeUsedMonths.has(month) && set.has(shiftKey(key, -1))) {
      freezeUsedMonths.add(month);
      usedFreeze = true;
      key = shiftKey(key, -1);
      continue;
    }
    break;
  }
  return { streak, usedFreeze };
}

/* ---------- 演出（トースト・紙吹雪） ---------- */

function toast(message) {
  const zone = $("#toastZone");
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  zone.appendChild(el);
  setTimeout(() => el.classList.add("is-out"), 3200);
  setTimeout(() => el.remove(), 3800);
}

function celebrate(word) {
  const layer = $("#celebrateLayer");
  layer.hidden = false;
  layer.innerHTML = "";
  const powWords = ["POW!", "NICE!", "BOOM!", "WOW!", "COOL!"];
  const pow = document.createElement("span");
  pow.className = "pow-word";
  pow.textContent = word || powWords[Math.floor(Math.random() * powWords.length)];
  layer.appendChild(pow);
  const colors = ["#ff3b5c", "#ffc93c", "#28a7e9", "#23c483", "#7d5fff"];
  for (let i = 0; i < 60; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.6}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    layer.appendChild(piece);
  }
  setTimeout(() => { layer.hidden = true; layer.innerHTML = ""; }, 2600);
}

function awardBadge(id) {
  if (state.badges.includes(id)) return;
  const def = badgeDefs.find((b) => b.id === id);
  if (!def) return;
  state.badges.push(id);
  saveState();
  toast(`${def.emoji} バッジ獲得: ${def.name}`);
  celebrate();
  renderBadges();
}

/* ---------- XPと日次記録 ---------- */

function grantXp(unit, amount) {
  state.xp += amount;
  state.skillXp[unit] = (state.skillXp[unit] || 0) + amount;
}

function recordUnit(unit, xpAmount) {
  const log = todayLog();
  const firstToday = log.units.length === 0;
  const firstTimeForUnit = !log.units.includes(unit);

  if (firstTimeForUnit) {
    log.units.push(unit);
    grantXp(unit, xpAmount);
  }

  if (!state.doneDays.includes(todayKey)) {
    state.doneDays.push(todayKey);
    if (state.doneDays.length > 400) state.doneDays = state.doneDays.slice(-400);
  }

  saveState();

  const { streak } = calculateStreak(state.doneDays);
  if (firstToday) toast(`今日の学習を記録しました（${streak}日連続）`);
  if (streak >= 3) awardBadge("streak-3");
  if (streak >= 7) awardBadge("streak-7");
  if (log.units.length === UNITS.length) awardBadge("perfect-day");

  renderProgress();
  renderPlan();
  return firstTimeForUnit;
}

/* ---------- 診断 ---------- */

function handleDiagnosis(form) {
  const data = new FormData(form);
  const writing = String(data.get("writing") || "");
  const writingScore = Math.min(4, Math.floor(writing.split(/\s+/).filter(Boolean).length / 6));
  const quizScore = (data.get("vocab") === DIAG_ANSWERS.vocab ? 2 : 0) + (data.get("grammar") === DIAG_ANSWERS.grammar ? 2 : 0);
  const score = Number(data.get("confidence")) * 2 + quizScore + writingScore;

  const previousLevel = state.level;
  const isFirst = state.diagnoses.length === 0;
  state.goal = String(data.get("goal"));
  state.level = getLevel(score);
  state.diagnoses.push({ d: todayKey, score, level: state.level });
  if (state.diagnoses.length > 24) state.diagnoses = state.diagnoses.slice(-24);
  if (isFirst) state.xp += 30; // 初回診断ボーナスのみ。以降レベルとXPは独立。
  saveState();

  if (!isFirst) awardBadge("rediagnosis");
  if (previousLevel && levels.indexOf(state.level) > levels.indexOf(previousLevel)) {
    awardBadge("level-up");
    toast(`🚀 レベルアップ！ ${previousLevel} → ${state.level}`);
    celebrate("LEVEL UP!");
  } else if (previousLevel && state.level !== previousLevel) {
    toast(`診断結果: ${state.level}（前回 ${previousLevel}）`);
  } else {
    toast(`診断完了！ あなたの現在地は ${state.level} です`);
  }

  vocabSession = null;
  renderAll();
  setSkill("speaking");
  $("#plan").scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- 4技能: 課題表示と採点 ---------- */

let activeSkill = "speaking";
let modelRevealed = false;
let playCount = 0;
let recognizing = false;
let usedMic = false;

function setSkill(skill) {
  activeSkill = skill;
  modelRevealed = false;
  playCount = 0;
  usedMic = false;
  const task = todaysTask(skill);
  const isListening = skill === "listening";
  const isReading = skill === "reading";

  $("#skillMode").textContent = skill[0].toUpperCase() + skill.slice(1);
  $("#skillTitle").textContent = task.t;
  $("#skillPrompt").textContent = isListening
    ? "▶ を押して音声を聞き、聞こえた英文をそのまま書き取ってください。（再生は何度でもOK、まずは2回で挑戦）"
    : isReading ? task.q : task.p;

  const passage = $("#skillPassage");
  passage.hidden = !task.x;
  passage.textContent = task.x || "";

  // 読解パッセージの訳は「まず英語で読む」ため初期状態では隠し、ボタンで開く
  $("#passageTools").hidden = !task.x;
  $("#passageJa").hidden = true;
  $("#passageJa").textContent = task.x ? (translations[task.x] || "") : "";
  $("#passageJaButton").textContent = "🇯🇵 日本語訳を見る";

  $("#listenTools").hidden = !isListening;
  $("#listenCount").textContent = "";

  $("#answerTools").hidden = isReading;
  $("#readingChoices").hidden = !isReading;
  if (isReading) renderReadingChoices(task);

  $("#skillAnswer").value = "";
  $("#skillAnswer").placeholder = skill === "speaking"
    ? "🎙で話すか、話す内容をタイプしてください"
    : isListening ? "聞こえた英文を書き取ってください" : "Type your answer...";
  $("#starRow").hidden = true;
  $("#modelAnswerBox").hidden = true;
  $("#micStatus").textContent = "";
  $("#feedbackText").textContent = unitDone(skill)
    ? "今日のこの課題はクリア済み。もう一度挑戦しても、明日新しい課題でもOKです。"
    : isReading
    ? "本文を読んで、正しい選択肢を選んでください。"
    : "回答を書いたらチェックできます。キーフレーズ・具体性・自然さを見ます。";
  $$(".tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.skill === skill));
}

function renderReadingChoices(task) {
  $("#readingChoices").innerHTML = task.choices.map((choice, index) =>
    `<button class="choice-button" type="button" data-index="${index}">${escapeHtml(choice)}</button>`
  ).join("");
}

function checkReadingChoice(index, buttonEl) {
  const task = todaysTask("reading");
  const correct = index === task.correct;

  if (!correct) {
    buttonEl.disabled = true;
    buttonEl.classList.add("is-wrong");
    $("#feedbackText").textContent = "不正解です。本文を読み直して、他の選択肢を試してみましょう。";
    return;
  }

  $$("#readingChoices .choice-button").forEach((btn, i) => {
    btn.disabled = true;
    if (i === task.correct) btn.classList.add("is-correct");
  });

  showStars(3);
  $("#feedbackText").textContent = "正解です！本文の内容を正しく読み取れています。";
  if (task.x) revealPassageJa(true);

  const xp = 25;
  const counted = recordUnit("reading", xp);
  if (counted) {
    toast(`+${xp} XP（Reading）`);
    awardBadge("first-task");
    state.history.push({ d: todayKey, skill: "reading", task: task.t, answer: task.choices[index], stars: 3 });
    if (state.history.length > 200) state.history = state.history.slice(-200);
    saveState();
    renderHistory();
  } else {
    $("#feedbackText").textContent += " （今日のXPは獲得済み。練習モードです）";
  }
}

function normalizeWords(text) {
  return text.toLowerCase().replace(/[^a-z0-9'\s]/g, " ").split(/\s+/).filter(Boolean);
}

function scoreDictation(answer, script) {
  const scriptWords = normalizeWords(script);
  const answerWords = new Set(normalizeWords(answer));
  const hits = scriptWords.filter((w) => answerWords.has(w)).length;
  return scriptWords.length ? hits / scriptWords.length : 0;
}

function scoreKeyPhrases(answer, task) {
  const lower = answer.toLowerCase();
  const hits = task.k.filter((phrase) => lower.includes(phrase));
  return { ratio: task.k.length ? hits.length / task.k.length : 1, missing: task.k.filter((p) => !lower.includes(p)) };
}

function revealPassageJa(show) {
  const el = $("#passageJa");
  if (!el.textContent) return;
  el.hidden = !show;
  $("#passageJaButton").textContent = show ? "🇯🇵 日本語訳を隠す" : "🇯🇵 日本語訳を見る";
}

function showStars(stars) {
  const row = $("#starRow");
  row.hidden = false;
  row.textContent = "★".repeat(stars) + "☆".repeat(3 - stars);
}

function showModelAnswer(text, label) {
  modelRevealed = true;
  $("#modelAnswerBox").hidden = false;
  $("#modelAnswerLabel").textContent = label || "Model answer";
  $("#modelAnswerText").textContent = text;
  const ja = translations[text];
  $("#modelAnswerJa").textContent = ja || "";
  $("#modelAnswerJa").hidden = !ja;
}

function checkAnswer() {
  const answer = $("#skillAnswer").value.trim();
  const task = todaysTask(activeSkill);

  if (!answer) {
    $("#feedbackText").textContent = activeSkill === "listening"
      ? "まず音声を再生して、聞こえた単語だけでも書いてみましょう。部分点も付きます。"
      : "まず1文だけでも入力してください。短くても、目的が伝わる文なら評価できます。";
    return;
  }

  let stars = 0;
  let message = "";

  if (activeSkill === "listening") {
    const ratio = scoreDictation(answer, task.s);
    const percent = Math.round(ratio * 100);
    stars = ratio >= 0.8 ? 3 : ratio >= 0.5 ? 2 : ratio >= 0.2 ? 1 : 0;
    message = `聞き取り一致率 ${percent}%。`;
    if (stars === 3) message += " ほぼ完璧です！";
    else if (stars === 2) message += " 骨組みは取れています。もう一度🐢でゆっくり聞いてみましょう。";
    else message += " まず数字・地名・動詞だけ拾う練習から。スクリプトを見て音と文字を結びつけましょう。";
    showModelAnswer(task.s, "Script（音声の英文）");
  } else {
    const wordCount = normalizeWords(answer).length;
    const { ratio, missing } = scoreKeyPhrases(answer, task);
    const hasPolite = /\b(could|would|please|thank|appreciate)\b/i.test(answer);
    const advice = [];

    stars = ratio >= 0.99 ? 3 : ratio >= 0.5 ? 2 : ratio > 0 || wordCount >= 6 ? 1 : 0;
    if (tier() === "basic" && wordCount < 6) {
      advice.push("もう1つ情報を足すと、実際の場面で伝わりやすくなります。");
      stars = Math.min(stars, 1);
    }
    if (tier() === "plus" && wordCount < 15) {
      advice.push("B1以上を目指すなら、理由や補足をもう1文足してみましょう。");
      stars = Math.min(stars, 2);
    }
    if ((activeSkill === "speaking" || activeSkill === "writing") && !hasPolite && /依頼|お願い|尋ね|頼/.test(task.p)) {
      advice.push("依頼や質問では could / would / please を入れると自然です。");
    }
    if (missing.length > 0) {
      advice.push(`模範解答では ${missing.map((m) => `“${m}”`).join(", ")} のような表現が鍵になっています。`);
    }

    message = stars === 3
      ? "素晴らしい回答です。キーフレーズも情報量も揃っています。"
      : advice.join(" ") || "方向性は良いです。模範解答と見比べて、使える表現を1つ盗みましょう。";
    showModelAnswer(task.m);
    // 回答後は隠す理由がないので、読解パッセージの訳も開いておく
    if (task.x) revealPassageJa(true);
  }

  showStars(stars);
  $("#feedbackText").textContent = message;

  if (stars >= 1) {
    const xp = 10 + stars * 5;
    const counted = recordUnit(activeSkill, xp);
    if (counted) {
      toast(`+${xp} XP（${$("#skillMode").textContent}）`);
      awardBadge("first-task");
      if (activeSkill === "listening" && stars === 3) awardBadge("listener");
      if (activeSkill === "speaking" && usedMic) awardBadge("speaker");
      state.history.push({ d: todayKey, skill: activeSkill, task: task.t, answer, stars });
      if (state.history.length > 200) state.history = state.history.slice(-200);
      saveState();
      renderHistory();
    } else {
      $("#feedbackText").textContent += " （今日のXPは獲得済み。練習モードです）";
    }
  }
}

/* ---------- 音声（TTS / 音声認識） ---------- */

function speak(text, rate = 0.95) {
  if (!("speechSynthesis" in window)) {
    toast("このブラウザは音声再生に対応していません");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

function playListening(rate) {
  const task = todaysTask("listening");
  if (activeSkill !== "listening" || !task.s) return;
  playCount += 1;
  $("#listenCount").textContent = `再生 ${playCount}回`;
  speak(task.s, rate);
}

function startRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const status = $("#micStatus");
  if (!SpeechRecognition) {
    status.textContent = "このブラウザでは音声入力が使えません。英文を入力してチェックしてください。";
    return;
  }
  if (recognizing) return;
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognizing = true;
  status.textContent = "🎙 聞き取り中… 英語で話してください";
  recognition.onresult = (event) => {
    usedMic = true;
    $("#skillAnswer").value = event.results[0][0].transcript;
    checkAnswer();
  };
  recognition.onerror = (event) => {
    const reasons = {
      "not-allowed": "マイクの使用が許可されていません。ブラウザの設定を確認してください。",
      "no-speech": "音声が聞き取れませんでした。もう一度試してください。",
      "audio-capture": "マイクが見つかりません。接続を確認してください。"
    };
    status.textContent = reasons[event.error] || "音声入力でエラーが起きました。入力欄にタイプしてもOKです。";
  };
  recognition.onend = () => {
    recognizing = false;
    if (status.textContent.startsWith("🎙")) status.textContent = "";
  };
  recognition.start();
}

/* ---------- 単語SRS ---------- */

let vocabSession = null; // { queue: [{id, word, isNew}], index, done, correct }

function vocabId(goal, word) {
  return `${goal}:${word.w}`;
}

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildVocabSession() {
  const goal = state.goal || "travel";
  const deck = vocabDecks[goal];
  const due = [];
  const fresh = [];
  deck.forEach((word) => {
    const id = vocabId(goal, word);
    const entry = state.vocab[id];
    if (!entry) fresh.push({ id, word, isNew: true });
    else if (entry.due <= todayKey) due.push({ id, word, isNew: false, due: entry.due });
  });
  // 復習は「期限切れが長い順」に並べる（デッキ順で固定の単語ばかり出る偏りを防ぐ）
  due.sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : 0));

  // その日のノルマ達成後は、新出カードを追加せず期限が来た復習だけを出す
  if (unitDone("vocab")) {
    return { queue: due.slice(0, VOCAB_DAILY), index: 0, correct: 0 };
  }

  // 復習が溜まっていても新出単語の枠を確保し、いつまでも新しい単語が出ない状態を防ぐ
  const newSlot = Math.min(VOCAB_NEW_PER_DAY, fresh.length, VOCAB_DAILY);
  const reviewSlot = VOCAB_DAILY - newSlot;
  const queue = [...due.slice(0, reviewSlot), ...shuffle(fresh).slice(0, newSlot)];
  if (queue.length < VOCAB_DAILY) {
    queue.push(...due.slice(reviewSlot, reviewSlot + (VOCAB_DAILY - queue.length)));
  }
  return { queue: shuffle(queue), index: 0, correct: 0 };
}

function currentVocabCard() {
  if (!vocabSession) vocabSession = buildVocabSession();
  return vocabSession.queue[vocabSession.index] || null;
}

function generateVocabChoices(goal, word) {
  const deck = vocabDecks[goal] || [];
  const distractorPool = deck.filter((w) => w.ja !== word.ja);
  const distractors = shuffle(distractorPool).slice(0, 2).map((w) => w.ja);
  return shuffle([word.ja, ...distractors]);
}

function renderVocab() {
  const card = currentVocabCard();
  const total = vocabSession.queue.length;
  const learned = Object.values(state.vocab).filter((v) => v.box >= 3).length;
  const dueTomorrow = Object.values(state.vocab).filter((v) => v.due === shiftKey(todayKey, 1)).length;

  $("#vocabStats").textContent = state.goal
    ? `これまでに ${state.wordsSeen} 語に出会い、${learned} 語が定着ゾーン（Box3以上）。明日の復習は ${dueTomorrow} 語です。`
    : "診断すると、目的に合った単語デッキが始まります。";

  if (!card) {
    $("#vocabProgress").textContent = `${total} / ${total}`;
    $("#vocabKind").textContent = "完了";
    $("#vocabWord").textContent = total === 0 && !unitDone("vocab") ? "今日の分は明日また" : "今日の単語はクリア！";
    $("#vocabExample").textContent = total === 0 && !unitDone("vocab")
      ? "復習期限の単語がありません。課題タブで4技能を進めましょう。"
      : "明日になると復習カードが届きます。忘れた頃が覚えどきです。";
    $("#vocabAnswer").hidden = true;
    $("#vocabExampleJa").hidden = true;
    $("#vocabChoices").innerHTML = "";
    $("#vocabNextButton").hidden = true;
    $("#vocabSpeakButton").hidden = true;
    return;
  }

  $("#vocabProgress").textContent = `${vocabSession.index + 1} / ${total}`;
  $("#vocabKind").textContent = card.isNew ? "新しい単語" : "復習";
  $("#vocabWord").textContent = card.word.w;
  $("#vocabExample").textContent = card.word.ex;
  $("#vocabExampleJa").textContent = card.word.exj || "";
  $("#vocabExampleJa").hidden = true;
  $("#vocabAnswer").hidden = true;
  $("#vocabAnswer").textContent = "";
  $("#vocabNextButton").hidden = true;
  $("#vocabSpeakButton").hidden = false;

  const options = generateVocabChoices(state.goal || "travel", card.word);
  $("#vocabChoices").innerHTML = options.map((option) =>
    `<button class="choice-button" type="button" data-value="${escapeHtml(option)}">${escapeHtml(option)}</button>`
  ).join("");
}

function chooseVocabAnswer(chosenJa, buttonEl) {
  const card = currentVocabCard();
  if (!card) return;
  const correct = chosenJa === card.word.ja;

  $$("#vocabChoices .choice-button").forEach((btn) => {
    btn.disabled = true;
    if (btn.dataset.value === card.word.ja) btn.classList.add("is-correct");
    else if (btn === buttonEl) btn.classList.add("is-wrong");
  });

  $("#vocabAnswer").textContent = correct ? `正解: ${card.word.ja}` : `不正解。正解は「${card.word.ja}」`;
  $("#vocabAnswer").hidden = false;
  $("#vocabExampleJa").hidden = !card.word.exj;
  $("#vocabNextButton").hidden = false;

  gradeVocab(correct);
}

function gradeVocab(known) {
  const card = currentVocabCard();
  if (!card) return;
  const entry = state.vocab[card.id] || { box: 0, due: todayKey, seen: 0 };
  if (entry.seen === 0) state.wordsSeen += 1;
  entry.seen += 1;
  entry.box = known ? Math.min(5, entry.box + 1) : 1;
  entry.due = shiftKey(todayKey, SRS_INTERVALS[entry.box]);
  state.vocab[card.id] = entry;
  if (known) vocabSession.correct += 1;
  saveState();
}

function advanceVocab() {
  vocabSession.index += 1;

  if (vocabSession.index >= vocabSession.queue.length) {
    const counted = recordUnit("vocab", 20);
    if (counted) toast("+20 XP（今日の単語コンプリート！）");
    if (state.wordsSeen >= 10) awardBadge("vocab-10");
    if (state.wordsSeen >= 50) awardBadge("vocab-50");
  }
  renderVocab();
  renderProgress();
}

/* ---------- 描画 ---------- */

function renderProgress() {
  const { streak, usedFreeze } = calculateStreak(state.doneDays);
  state.streak = streak;
  $("#streakCount").textContent = streak;
  $("#freezeBadge").hidden = !usedFreeze;
  $("#xpCount").textContent = state.xp;
  $("#levelLabel").textContent = state.level || "未診断";
  $("#heroLevel").textContent = state.level || "未診断";

  const unitsDone = (state.dayLog[todayKey]?.units || []).length;
  $("#ringText").textContent = `${unitsDone}/${UNITS.length}`;
  $("#xpRing").style.strokeDashoffset = 314 - 314 * (unitsDone / UNITS.length);

  $("#heroCta").textContent = state.level ? "今日のメニューへ" : "診断を始める";
  $("#heroCta").href = state.level ? "#plan" : "#diagnostic";

  $("#levelLadder").innerHTML = levels.map((level) => `
    <div class="level-step ${level === state.level ? "is-current" : ""}">
      <strong>${level}</strong>
      <span>${levelDescriptions(level)}</span>
    </div>
  `).join("");

  renderWeek(streak);
  renderRadar();
  renderDiagChart();
}

function renderWeek(streak) {
  const doneDays = new Set(state.doneDays);
  const labels = ["月", "火", "水", "木", "金", "土", "日"];
  const now = new Date();
  const isoDay = now.getDay() || 7; // 月=1 ... 日=7
  let doneThisWeek = 0;
  $("#weekRow").innerHTML = labels.map((label, index) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - isoDay + index + 1);
    const key = dateKey(date);
    const isDone = doneDays.has(key);
    if (isDone) doneThisWeek += 1;
    return `<div class="day-dot ${isDone ? "is-done" : ""} ${key === todayKey ? "is-today" : ""}">${label}</div>`;
  }).join("");

  const goalDays = state.settings.weeklyGoal;
  const reached = doneThisWeek >= goalDays;
  $("#habitMessage").textContent = reached
    ? `今週の目標 ${goalDays}日 を達成！ ${doneThisWeek}日学習、連続${streak}日です。`
    : `今週 ${doneThisWeek}/${goalDays}日。課題か単語を1つ終えると、その日が自動で記録されます。`;
}

function renderRadar() {
  const svg = $("#radarChart");
  const axes = [
    ["Vocab", "vocab"], ["Speak", "speaking"], ["Write", "writing"], ["Read", "reading"], ["Listen", "listening"]
  ];
  const cx = 120; const cy = 112; const radius = 78;
  const point = (i, r) => {
    const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };
  const ringPath = (r) => axes.map((_, i) => point(i, r).map((n) => n.toFixed(1)).join(",")).join(" ");
  const values = axes.map(([, key]) => Math.min(1, (state.skillXp[key] || 0) / 300));
  const valuePath = axes.map((_, i) => point(i, Math.max(0.04, values[i]) * radius).map((n) => n.toFixed(1)).join(",")).join(" ");

  svg.innerHTML = `
    ${[0.33, 0.66, 1].map((f) => `<polygon points="${ringPath(radius * f)}" class="radar-ring"></polygon>`).join("")}
    ${axes.map((_, i) => { const [x, y] = point(i, radius); return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" class="radar-ring"></line>`; }).join("")}
    <polygon points="${valuePath}" class="radar-value"></polygon>
    ${axes.map(([label], i) => {
      const [x, y] = point(i, radius + 16);
      return `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle" class="radar-label">${label}</text>`;
    }).join("")}
  `;
}

function renderDiagChart() {
  const svg = $("#diagChart");
  const entries = state.diagnoses.slice(-6);
  if (entries.length === 0) {
    svg.innerHTML = `<text x="130" y="75" text-anchor="middle" class="radar-label">診断するとスコアが記録されます</text>`;
    return;
  }
  const maxScore = 16;
  const barWidth = 26;
  const gap = 14;
  const baseY = 112;
  const startX = 130 - ((entries.length * barWidth + (entries.length - 1) * gap) / 2);
  svg.innerHTML = entries.map((entry, i) => {
    const height = Math.max(6, (entry.score / maxScore) * 84);
    const x = startX + i * (barWidth + gap);
    return `
      <rect x="${x}" y="${baseY - height}" width="${barWidth}" height="${height}" rx="4" class="diag-bar"></rect>
      <text x="${x + barWidth / 2}" y="${baseY - height - 6}" text-anchor="middle" class="radar-label">${entry.level}</text>
      <text x="${x + barWidth / 2}" y="${baseY + 16}" text-anchor="middle" class="radar-label small">${entry.d.slice(5).replace("-", "/")}</text>
    `;
  }).join("");
  const latest = entries[entries.length - 1];
  const first = entries[0];
  $("#diagNote").textContent = entries.length >= 2
    ? `初回 ${first.score}点 → 最新 ${latest.score}点。2週間に1回の再診断で伸びを確かめましょう。`
    : "2週間に1回の再診断で、レベルの伸びを確かめましょう。";
}

function renderPlan() {
  const goal = goalMeta[state.goal || "travel"];
  $("#goalLabel").textContent = state.goal ? goal.label : "未設定";
  $("#recommendedLevel").textContent = state.level ? `${state.level}（${tier() === "basic" ? "基礎" : "応用"}コース）` : "診断待ち";
  $("#focusLabel").textContent = state.goal ? goal.focus : "基礎確認";

  const minutes = tier() === "plus" ? { vocab: 5, speaking: 12, writing: 15, reading: 18, listening: 10 } : { vocab: 5, speaking: 6, writing: 8, reading: 10, listening: 6 };
  const names = { vocab: "Vocab", speaking: "Speaking", writing: "Writing", reading: "Reading", listening: "Listening" };

  $("#dailyPlan").innerHTML = UNITS.map((unit) => {
    const done = unitDone(unit);
    const title = unit === "vocab" ? "今日の単語 10枚" : todaysTask(unit).t;
    const desc = unit === "vocab" ? "SRSで新出と復習をミックス。"
      : unit === "listening" ? "音声を聞いて書き取るディクテーション。"
      : unit === "reading" ? "本文を読んで、3択の問題に答えよう。"
      : todaysTask(unit).p;
    return `
      <button type="button" class="daily-task ${done ? "is-done" : ""}" data-unit="${unit}">
        <span class="tag">${names[unit]} ${minutes[unit]}分</span>
        <strong>${done ? "✅ " : ""}${title}</strong>
        <p>${desc}</p>
      </button>
    `;
  }).join("");

  $$("#dailyPlan .daily-task").forEach((cardEl) => {
    cardEl.addEventListener("click", () => {
      const unit = cardEl.dataset.unit;
      if (unit === "vocab") {
        $("#vocab").scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        setSkill(unit);
        $("#skills").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

function renderBadges() {
  $("#badgeGrid").innerHTML = badgeDefs.map((badge) => {
    const owned = state.badges.includes(badge.id);
    return `
      <div class="badge ${owned ? "is-owned" : ""}" title="${badge.desc}">
        <span class="badge-emoji">${badge.emoji}</span>
        <span class="badge-name">${badge.name}</span>
      </div>
    `;
  }).join("");
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function renderHistory() {
  const items = state.history.slice(-5).reverse();
  $("#historyList").innerHTML = items.length === 0
    ? "<li class='history-empty'>課題をクリアすると、回答がここに残ります。過去の自分と見比べるのが一番の成長実感です。</li>"
    : items.map((item) => `
      <li>
        <span class="history-meta">${item.d.slice(5).replace("-", "/")} ・ ${item.skill} ・ ${"★".repeat(item.stars)}</span>
        <strong>${escapeHtml(item.task)}</strong>
        <p>${escapeHtml(item.answer)}</p>
      </li>
    `).join("");

  const first = state.history[0];
  const latest = state.history[state.history.length - 1];
  const days = first && latest ? dayNumber(latest.d) - dayNumber(first.d) : 0;
  $("#growthCompare").innerHTML = first && latest && first !== latest && days >= 1
    ? `
      <div class="compare-card">
        <span>${first.d.slice(5).replace("-", "/")} のあなた</span>
        <p>${escapeHtml(first.answer)}</p>
      </div>
      <div class="compare-arrow">→ ${days}日後</div>
      <div class="compare-card is-now">
        <span>いまのあなた</span>
        <p>${escapeHtml(latest.answer)}</p>
      </div>
    `
    : "";
}

/* ---------- 設定・データ ---------- */

function updateCalendarLink() {
  const time = ($("#reminderTime").value || "21:00").replace(":", "");
  const start = todayKey.replace(/-/g, "") + "T" + time + "00";
  const endMinutes = (Number(time.slice(0, 2)) * 60 + Number(time.slice(2)) + 20) % 1440;
  const end = todayKey.replace(/-/g, "") + "T" + String(Math.floor(endMinutes / 60)).padStart(2, "0") + String(endMinutes % 60).padStart(2, "0") + "00";
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", "英語学習 (5分英語)");
  url.searchParams.set("details", "今日の単語10枚と4技能課題");
  url.searchParams.set("dates", `${start}/${end}`);
  url.searchParams.set("recur", "RRULE:FREQ=DAILY");
  $("#calendarLink").href = url.toString();
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `5min-english-backup-${todayKey}.json`;
  link.click();
  URL.revokeObjectURL(url);
  toast("バックアップを書き出しました");
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result));
      if (data.version !== 2 || typeof data.skillXp !== "object") throw new Error("invalid");
      state = Object.assign(defaultState(), data, {
        skillXp: Object.assign(defaultState().skillXp, data.skillXp || {}),
        settings: Object.assign(defaultState().settings, data.settings || {})
      });
      saveState();
      vocabSession = null;
      renderAll();
      if (state.level) setSkill(activeSkill);
      toast("データを読み込みました");
    } catch {
      toast("読み込めませんでした。5分英語の書き出しファイルを選んでください。");
    }
  };
  reader.readAsText(file);
}

/* ---------- クラウドアカウント（ログイン・同期） ----------
   window.FluentCloud は cloud.js が提供する（Supabase未設定時は `?.` で常に無視される）。 */

let cloudMigrationDone = false;

function renderAuthArea(session) {
  const area = $("#authArea");
  if (session) {
    const email = session.user.email || "ログイン中";
    area.innerHTML = `
      <span class="auth-email">${escapeHtml(email)}</span>
      <button class="ghost-button small" id="authSignOutButton" type="button">ログアウト</button>
    `;
  } else {
    area.innerHTML = `<button class="ghost-button small" id="authOpenButton" type="button">ログイン</button>`;
  }
}

function openAuthModal() {
  $("#authModalOverlay").hidden = false;
  $("#authStatus").textContent = "";
}

function closeAuthModal() {
  $("#authModalOverlay").hidden = true;
}

function isValidCloudState(candidate) {
  return Boolean(candidate) && candidate.version === 2 && typeof candidate.skillXp === "object";
}

function dedupeList(list) {
  return [...new Set(list)];
}

function dedupeByJson(listA, listB) {
  const seen = new Set();
  const out = [];
  [...listA, ...listB].forEach((item) => {
    const key = JSON.stringify(item);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  });
  return out;
}

function mergeMaxMap(a, b) {
  const out = { ...(a || {}) };
  Object.entries(b || {}).forEach(([key, value]) => {
    out[key] = Math.max(out[key] || 0, value || 0);
  });
  return out;
}

function mergeDayLog(a, b) {
  const out = {};
  const dates = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
  dates.forEach((d) => {
    const unitsA = (a && a[d] && a[d].units) || [];
    const unitsB = (b && b[d] && b[d].units) || [];
    out[d] = { units: dedupeList([...unitsA, ...unitsB]) };
  });
  return out;
}

function mergeVocabProgress(a, b) {
  const out = { ...(a || {}) };
  Object.entries(b || {}).forEach(([id, entry]) => {
    const existing = out[id];
    // 単語ごとに「より進んでいる方」（box が高い、同じなら復習期限が遅い方）を残す
    if (!existing || entry.box > existing.box || (entry.box === existing.box && entry.due > existing.due)) {
      out[id] = entry;
    }
  });
  return out;
}

function latestDiagnosis(list) {
  if (!Array.isArray(list) || list.length === 0) return null;
  return [...list].sort((a, b) => (a.d < b.d ? 1 : -1))[0];
}

// クラウドと端末、双方の進捗を突き合わせ、どちらか一方だけを正とせず「失われるものがない」形に統合する
function mergeStates(local, cloud) {
  const localDiag = latestDiagnosis(local.diagnoses);
  const cloudDiag = latestDiagnosis(cloud.diagnoses);
  const useCloudLevel = Boolean(cloudDiag) && (!localDiag || cloudDiag.d > localDiag.d);

  return {
    version: 2,
    goal: (useCloudLevel ? cloud.goal : local.goal) || local.goal || cloud.goal || null,
    level: (useCloudLevel ? cloud.level : local.level) || local.level || cloud.level || null,
    xp: Math.max(local.xp || 0, cloud.xp || 0),
    skillXp: mergeMaxMap(local.skillXp, cloud.skillXp),
    doneDays: dedupeList([...(local.doneDays || []), ...(cloud.doneDays || [])]),
    dayLog: mergeDayLog(local.dayLog, cloud.dayLog),
    vocab: mergeVocabProgress(local.vocab, cloud.vocab),
    wordsSeen: Math.max(local.wordsSeen || 0, cloud.wordsSeen || 0),
    history: dedupeByJson(local.history || [], cloud.history || []),
    badges: dedupeList([...(local.badges || []), ...(cloud.badges || [])]),
    diagnoses: dedupeByJson(local.diagnoses || [], cloud.diagnoses || []),
    settings: local.settings || cloud.settings
  };
}

async function handleAuthSession(session) {
  renderAuthArea(session);

  if (!session) {
    cloudMigrationDone = false;
    return;
  }
  if (cloudMigrationDone) return;
  cloudMigrationDone = true;
  closeAuthModal();

  const hasRow = await window.FluentCloud.hasCloudRow();
  if (hasRow) {
    const cloudState = await window.FluentCloud.pullCloudState();
    if (isValidCloudState(cloudState)) {
      // どちらか一方を正とせず、端末とクラウドの進捗をマージする（XP・単語の定着度・連続記録などは大きい方を採用）
      const merged = mergeStates(state, cloudState);
      state = Object.assign(defaultState(), merged, {
        skillXp: Object.assign(defaultState().skillXp, merged.skillXp || {}),
        settings: Object.assign(defaultState().settings, merged.settings || {})
      });
      localStorage.setItem("fluentPathState", JSON.stringify(state));
      // マージ結果を書き戻し、他の端末の古いデータで再び上書きされないようにする
      await window.FluentCloud.pushCloudState(state);
      vocabSession = null;
      renderAll();
      if (state.level) setSkill(activeSkill);
      toast("☁️ クラウドと端末の進捗をマージしました");
    }
  } else {
    // 初回ログイン: 今のローカル進捗をそのままクラウドへ引き継ぐ
    await window.FluentCloud.pushCloudState(state);
    toast("☁️ ログインしました。この端末の進捗をクラウドに保存しました");
  }
}

/* ---------- 初期化 ---------- */

function renderAll() {
  renderPlan();
  renderProgress();
  renderBadges();
  renderHistory();
  vocabSession = buildVocabSession();
  renderVocab();
  $("#weeklyGoalSelect").value = String(state.settings.weeklyGoal);
  $("#reminderTime").value = state.settings.reminderTime;
  updateCalendarLink();
}

$("#diagnosticForm").addEventListener("submit", (event) => {
  event.preventDefault();
  handleDiagnosis(event.currentTarget);
});

$$(".tab").forEach((tab) => tab.addEventListener("click", () => setSkill(tab.dataset.skill)));
$("#checkAnswerButton").addEventListener("click", checkAnswer);
$("#speakButton").addEventListener("click", startRecognition);
$("#passageJaButton").addEventListener("click", () => revealPassageJa($("#passageJa").hidden));
$("#playAudioButton").addEventListener("click", () => playListening(0.95));
$("#playSlowButton").addEventListener("click", () => playListening(0.68));
$("#modelSpeakButton").addEventListener("click", () => {
  if (modelRevealed) speak($("#modelAnswerText").textContent);
});
$("#readingChoices").addEventListener("click", (event) => {
  const btn = event.target.closest(".choice-button");
  if (!btn || btn.disabled) return;
  checkReadingChoice(Number(btn.dataset.index), btn);
});

$("#vocabChoices").addEventListener("click", (event) => {
  const btn = event.target.closest(".choice-button");
  if (!btn || btn.disabled) return;
  chooseVocabAnswer(btn.dataset.value, btn);
});
$("#vocabNextButton").addEventListener("click", advanceVocab);
$("#vocabSpeakButton").addEventListener("click", () => {
  const card = currentVocabCard();
  if (card) speak(`${card.word.w}. ${card.word.ex}`);
});

$("#weeklyGoalSelect").addEventListener("change", (event) => {
  state.settings.weeklyGoal = Number(event.target.value);
  saveState();
  renderProgress();
});
$("#reminderTime").addEventListener("change", (event) => {
  state.settings.reminderTime = event.target.value;
  saveState();
  updateCalendarLink();
});
$("#exportButton").addEventListener("click", exportData);
$("#importInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) importData(file);
  event.target.value = "";
});

$("#authArea").addEventListener("click", (event) => {
  if (event.target.id === "authOpenButton") openAuthModal();
  if (event.target.id === "authSignOutButton") window.FluentCloud?.signOut();
});
$("#authModalClose").addEventListener("click", closeAuthModal);
$("#authModalOverlay").addEventListener("click", (event) => {
  if (event.target === $("#authModalOverlay")) closeAuthModal();
});
$("#authEmailButton").addEventListener("click", async () => {
  const email = $("#authEmailInput").value.trim();
  const status = $("#authStatus");
  if (!email) {
    status.textContent = "メールアドレスを入力してください。";
    return;
  }
  if (!window.FluentCloud?.isConfigured) {
    status.textContent = "ログイン機能は準備中です。しばらくお待ちください。";
    return;
  }
  status.textContent = "送信中…";
  const consent = $("#authMarketingCheckbox").checked;
  const { error } = await window.FluentCloud.signInWithEmail(email, consent);
  status.textContent = error
    ? `送信できませんでした: ${error.message}`
    : "ログインリンクをメールで送りました。メール内のリンクを開いてください。";
});
$("#authGoogleButton").addEventListener("click", async () => {
  const status = $("#authStatus");
  if (!window.FluentCloud?.isConfigured) {
    status.textContent = "ログイン機能は準備中です。しばらくお待ちください。";
    return;
  }
  const consent = $("#authMarketingCheckbox").checked;
  const { error } = await window.FluentCloud.signInWithGoogle(consent);
  if (error) status.textContent = `ログインできませんでした: ${error.message}`;
});

window.FluentCloud?.onAuthChange(handleAuthSession);

checkTranslations();
renderAll();
if (state.level) setSkill("speaking");
