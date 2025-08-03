-- ダミーデータ投入用SQL
-- まず既存のカテゴリIDを取得するための変数を設定

DO $$
DECLARE
  dog_id UUID;
  cat_id UUID;
  dog_care_id UUID;
  dog_health_id UUID;
  dog_training_id UUID;
  dog_chat_id UUID;
  cat_care_id UUID;
  cat_health_id UUID;
  cat_training_id UUID;
  cat_chat_id UUID;
  thread1_id UUID;
  thread2_id UUID;
  thread3_id UUID;
  response1_id UUID;
  response2_id UUID;
  response3_id UUID;
  response4_id UUID;
BEGIN
  -- カテゴリIDを取得
  SELECT id INTO dog_id FROM categories WHERE name = '犬' AND type = 'main';
  SELECT id INTO cat_id FROM categories WHERE name = '猫' AND type = 'main';
  
  SELECT id INTO dog_care_id FROM categories WHERE name = '飼育相談' AND type = 'sub' AND parent_id = dog_id;
  SELECT id INTO dog_health_id FROM categories WHERE name = '病気・健康' AND type = 'sub' AND parent_id = dog_id;
  SELECT id INTO dog_training_id FROM categories WHERE name = 'しつけ' AND type = 'sub' AND parent_id = dog_id;
  SELECT id INTO dog_chat_id FROM categories WHERE name = '雑談' AND type = 'sub' AND parent_id = dog_id;
  
  SELECT id INTO cat_care_id FROM categories WHERE name = '飼育相談' AND type = 'sub' AND parent_id = cat_id;
  SELECT id INTO cat_health_id FROM categories WHERE name = '病気・健康' AND type = 'sub' AND parent_id = cat_id;
  SELECT id INTO cat_training_id FROM categories WHERE name = 'しつけ' AND type = 'sub' AND parent_id = cat_id;
  SELECT id INTO cat_chat_id FROM categories WHERE name = '雑談' AND type = 'sub' AND parent_id = cat_id;

  -- スレッド1: 犬の飼育相談
  INSERT INTO threads (id, title, content, category_id, sub_category_id, user_ip, created_at)
  VALUES (
    gen_random_uuid(),
    '初めて犬を飼います！アドバイスください',
    E'来月から初めてゴールデンレトリーバーの子犬を飼うことになりました。\n\n準備しておくべきものや、気をつけることがあれば教えてください。\n特に散歩の時間や回数、餌の量などが心配です。\n\n経験者の方、よろしくお願いします！',
    dog_id,
    dog_care_id,
    '192.168.1.100'::inet,
    NOW() - INTERVAL '2 days'
  ) RETURNING id INTO thread1_id;

  -- スレッド2: 猫の健康相談
  INSERT INTO threads (id, title, content, category_id, sub_category_id, user_ip, created_at)
  VALUES (
    gen_random_uuid(),
    '猫が食欲不振で心配です',
    E'3歳のメスの混血猫を飼っています。\n昨日から急に食欲がなくなり、普段大好きなおやつも食べません。\n\n水は飲んでいますが、元気もなくてずっと寝ています。\n病院に連れて行くべきでしょうか？\n\n同じような経験をされた方はいますか？',
    cat_id,
    cat_health_id,
    '192.168.1.101'::inet,
    NOW() - INTERVAL '1 day'
  ) RETURNING id INTO thread2_id;

  -- スレッド3: 犬のしつけ
  INSERT INTO threads (id, title, content, category_id, sub_category_id, user_ip, created_at)
  VALUES (
    gen_random_uuid(),
    '柴犬の無駄吠えが直りません...',
    E'生後8ヶ月の柴犬のオスです。\n最近、夜中や早朝に無駄吠えをするようになってしまいました。\n\n近所迷惑になってしまうので、なんとか直したいのですが...\n色々試してみましたが効果がありません。\n\n何か良い方法はありませんか？',
    dog_id,
    dog_training_id,
    '192.168.1.102'::inet,
    NOW() - INTERVAL '12 hours'
  ) RETURNING id INTO thread3_id;

  -- スレッド1のレス
  -- レス1
  INSERT INTO responses (id, thread_id, content, user_ip, created_at)
  VALUES (
    gen_random_uuid(),
    thread1_id,
    E'ゴールデンレトリーバーは素晴らしい犬種ですね！\n\n準備するものとしては：\n・大型犬用のケージ\n・散歩用のリードとハーネス\n・大型犬用のフードボウル\n・おもちゃ（噛んでも安全なもの）\n\n散歩は子犬のうちは1日2-3回、各15-20分程度から始めて、成犬になったら1時間程度にするといいですよ。',
    '192.168.1.103'::inet,
    NOW() - INTERVAL '36 hours'
  ) RETURNING id INTO response1_id;

  -- レス2
  INSERT INTO responses (id, thread_id, content, user_ip, created_at)
  VALUES (
    gen_random_uuid(),
    thread1_id,
    E'>>1\n\n追加で、子犬のうちは社会化がとても重要です！\n生後3-4ヶ月の間に色々な人や犬、音に慣れさせておくと、後々のしつけが楽になります。\n\nまた、ゴールデンは毛が長いので、毎日のブラッシングも必須ですね。',
    '192.168.1.104'::inet,
    NOW() - INTERVAL '30 hours'
  ) RETURNING id INTO response2_id;

  -- レス3
  INSERT INTO responses (id, thread_id, content, user_ip, created_at)
  VALUES (
    gen_random_uuid(),
    thread1_id,
    E'>>1\n>>2\n\n皆さんありがとうございます！とても参考になります。\n\n社会化について詳しく教えていただけませんか？\n具体的にはどんなことをすればいいのでしょうか？',
    '192.168.1.100'::inet,
    NOW() - INTERVAL '24 hours'
  ) RETURNING id INTO response3_id;

  -- スレッド2のレス
  -- レス1
  INSERT INTO responses (id, thread_id, content, user_ip, created_at)
  VALUES (
    gen_random_uuid(),
    thread2_id,
    E'それは心配ですね。\n食欲不振が24時間以上続いている場合は、早めに病院に行った方がいいと思います。\n\n猫は体調不良を隠すのが上手なので、食欲がないというのは結構深刻な可能性があります。\n特に水しか飲まない状態が続くと脱水症状になる危険もあります。',
    '192.168.1.105'::inet,
    NOW() - INTERVAL '20 hours'
  ) RETURNING id INTO response4_id;

  -- レス2
  INSERT INTO responses (id, thread_id, content, user_ip, created_at)
  VALUES (
    gen_random_uuid(),
    thread2_id,
    E'>>1\n\n私も同意見です。\nうちの猫も以前同じような症状で、結果的に腎臓の問題でした。\n\n早期発見が重要なので、今日中にでも動物病院に連れて行くことをお勧めします。\n夜間診療をやっている病院もあるので、調べてみてください。',
    '192.168.1.106'::inet,
    NOW() - INTERVAL '18 hours'
  );

  -- レス3
  INSERT INTO responses (id, thread_id, content, user_ip, created_at)
  VALUES (
    gen_random_uuid(),
    thread2_id,
    E'>>1\n>>2\n\nありがとうございます。\nやはり病院に行った方がいいですね。\n\n幸い近くに夜間診療の病院があるので、今から連れて行ってきます。\n結果がわかったらまた報告します。',
    '192.168.1.101'::inet,
    NOW() - INTERVAL '16 hours'
  );

  -- スレッド3のレス
  -- レス1
  INSERT INTO responses (id, thread_id, content, user_ip, created_at)
  VALUES (
    gen_random_uuid(),
    thread3_id,
    E'柴犬の無駄吠え、困りますよね。\n\n我が家でも同じ問題がありました。効果があった方法は：\n\n1. 吠える原因を特定する（音、人、車など）\n2. 原因となる刺激に慣れさせる\n3. 吠えたときは完全に無視する\n4. 静かにしているときにご褒美をあげる\n\n特に「無視する」のが重要です。声をかけると「構ってもらえた」と勘違いしてしまいます。',
    '192.168.1.107'::inet,
    NOW() - INTERVAL '10 hours'
  );

  -- レス2
  INSERT INTO responses (id, thread_id, content, user_ip, created_at)
  VALUES (
    gen_random_uuid(),
    thread3_id,
    E'>>1\n\n追加で、運動量が足りないことも無駄吠えの原因になります。\n8ヶ月の柴犬だと、かなりエネルギーが有り余っているはずです。\n\n散歩の時間を増やしたり、家の中でも知育おもちゃで遊ばせるなど、十分に疲れさせてあげると夜は静かに寝てくれることが多いですよ。',
    '192.168.1.108'::inet,
    NOW() - INTERVAL '8 hours'
  );

  -- レス3
  INSERT INTO responses (id, thread_id, content, user_ip, created_at)
  VALUES (
    gen_random_uuid(),
    thread3_id,
    E'>>1\n>>2\n\n皆さんありがとうございます！\n確かに最近散歩の時間が短かったかもしれません。\n\n今日から散歩時間を増やして、吠えたときは無視するようにしてみます。\n知育おもちゃも買ってみようと思います。\n\n経過をまた報告させていただきますね。',
    '192.168.1.102'::inet,
    NOW() - INTERVAL '6 hours'
  );

  -- 追加のスレッドも作成
  -- スレッド4: 猫の雑談
  INSERT INTO threads (title, content, category_id, sub_category_id, user_ip, created_at)
  VALUES (
    'うちの猫の変な癖を自慢させてください',
    E'うちのスコティッシュフォールドの「ちゃちゃ」は、洗濯物をたたんでいると必ず邪魔しに来ます。\n\n特にタオルの上に座って動かなくなるのが定番で、毎回笑ってしまいます。\n\n皆さんの猫ちゃんの可愛い癖や面白い行動があれば教えてください！',
    cat_id,
    cat_chat_id,
    '192.168.1.109'::inet,
    NOW() - INTERVAL '6 hours'
  );

  -- そのスレッドにもレスを追加
  INSERT INTO responses (thread_id, content, user_ip, created_at)
  VALUES (
    (SELECT id FROM threads WHERE title = 'うちの猫の変な癖を自慢させてください'),
    E'可愛いですね！\n\nうちの猫は、私がトイレに入ると必ずドアの前で鳴いて待っています。\nまるで「大丈夫？」って心配してくれているみたいで、とても愛おしいです。\n\nあと、私が泣いていると頭突きして慰めてくれます。猫って本当に優しいですよね。',
    '192.168.1.110'::inet,
    NOW() - INTERVAL '4 hours'
  );

  INSERT INTO responses (thread_id, content, user_ip, created_at)
  VALUES (
    (SELECT id FROM threads WHERE title = 'うちの猫の変な癖を自慢させてください'),
    E'>>1\n\nそれ、すごくわかります！\n\nうちの猫は、私が仕事をしているとキーボードの上に座ってきます。\n在宅ワークが増えてから、オンライン会議中に猫が映り込むのが日常になりました。\n\n最近は会議の参加者の方が猫目当てで参加している気がします（笑）',
    '192.168.1.111'::inet,
    NOW() - INTERVAL '2 hours'
  );

END $$;