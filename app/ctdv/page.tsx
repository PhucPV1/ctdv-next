"use client";

import React, { useState } from "react";
import { PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import styles from "./page.module.css";
import {
  batch,
  Signal,
  useSignal,
  useSignalEffect,
} from "@preact/signals-react";

type AssignInfo = {
  name: string;
  breed: string;
  gender: string;
  location: string;
  time: string;
  info: string;
  phone: string;
};
type ActionType = {
  type:
    | "setName"
    | "setBreed"
    | "setGender"
    | "setLocation"
    | "setTime"
    | "setInfo"
    | "setPhone";
  payload: string;
};
const initialAssignInfo: AssignInfo = {
  gender: "",
  breed: "",
  info: "",
  location: "",
  name: "",
  phone: "",
  time: "",
};

type KeyInfo = { translate: string; order: number };
const ContentKeyInfo = new Map<keyof AssignInfo, KeyInfo>([
  ["name", { translate: "Tên", order: 0 }],
  ["breed", { translate: "Giống", order: 1 }],
  ["gender", { translate: "Giới tính", order: 2 }],
  ["location", { translate: "Khu vực lạc", order: 3 }],
  ["time", { translate: "Thời gian lạc", order: 4 }],
  ["info", { translate: "Đặc điểm nhận dạng", order: 5 }],
  ["phone", { translate: "Sdt liên hệ", order: 6 }],
]);
const optionTitle = new Map();
optionTitle.set("dog", "TÌM CHÓ LẠC");
optionTitle.set("cat", "TÌM MÈO LẠC");
optionTitle.set("dogFindOwner", "CHÓ LẠC TÌM CHỦ");
optionTitle.set("catFindOwner", "MÈO LẠC TÌM CHỦ");

const generateContent = (assignInfo: AssignInfo) => {
  const keys = Object.keys(assignInfo).sort((a, b) => {
    return (
      ContentKeyInfo.get(a as keyof AssignInfo)?.order! -
      ContentKeyInfo.get(b as keyof AssignInfo)?.order!
    );
  }) as Array<keyof AssignInfo>;
  return keys.reduce((content, currentKey) => {
    if (assignInfo[currentKey] !== "") {
      const breakDown = content === "" ? "" : "\n";
      return `${content}${breakDown}${
        ContentKeyInfo.get(currentKey)?.translate
      }: ${assignInfo[currentKey]}`;
    }
    return content;
  }, "");
};

export default function Ctdv() {
  const option: Signal<string> = useSignal("dog");
  const title: Signal<string> = useSignal("TÌM CHÓ LẠC");
  const inputtedContent: Signal<string> = useSignal("");
  const isAssigned: Signal<boolean> = useSignal(false);
  const assignInfo: Signal<AssignInfo> = useSignal(initialAssignInfo);
  const assignedContent: Signal<string[]> = useSignal(["a", "b", "c"]);
  const isContentChanged: Signal<boolean> = useSignal(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const contentRef: any = React.useRef();
  const finalRef: any = React.useRef();

  function handleChangeOption(value: string) {
    batch(() => {
      option.value = value;
      title.value = optionTitle.get(value);
    });
  }

  const handleOpenAssign = () => {
    setIsDialogOpen(true);
  };
  const handleReplicate = () => {
    navigator.clipboard
      .readText()
      .then((value) => {
        inputtedContent.value = value;
        isContentChanged.value = !isContentChanged;
      })
      .catch(() => alert("Replicate fail"));
  };

  const handleConfirmAssign = () => {
    isAssigned.value = true;
    setIsDialogOpen(false);
  };
  const handleReload = () => {
    window.location.reload();
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(finalRef.current.value)
      .then(() => alert("copy success"))
      .catch(() => alert("copy fail"));
  };

  useSignalEffect(() => {
    if (isAssigned.value) {
      contentRef.current.value = generateContent(assignInfo.value);
    }
    const footer =
      title.value === "TÌM CHÓ LẠC" || title.value === "TÌM MÈO LẠC"
        ? "Nhờ mọi người dành chút thời gian chia sẻ bài viết để bé có thể sớm về nhà. Mình cảm ơn và xin chân thành hậu tạ cho ai giúp tìm được bé ạ."
        : "Nhờ mọi người dành chút thời gian chia sẻ bài viết để bé có thể sớm về nhà ạ. Mình xin cảm ơn.";

    finalRef.current.value = `${title.value}
    
${contentRef.current.value
  .replaceAll(" :", ":")
  .replaceAll(" ,", ",")
  .replaceAll("( ", "(")
  .replaceAll(" )", ")")
  .replaceAll(" / mất:", ":")
  .replaceAll("Giống chó/mèo", "Giống")
  .split("\n")
  .map((line: string) => {
    return line.charAt(0).toUpperCase() + line.slice(1);
  })
  .join("\n")}
    
${footer}`;

    const _ = isAssigned.value;
    const __ = inputtedContent.value;
    const ___ = isContentChanged.value;
  });

  const handleContent = () => {
    batch(() => {
      inputtedContent.value = contentRef.current.value;
      assignedContent.value = contentRef.current.value.split(/\n/);
      isContentChanged.value = !isContentChanged.value;
    });
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["content-container"]}>
        <PawPrint className={styles["logo"]} />
        <h1 className={styles["title"]}>Tìm Chó Mèo Lạc Đà Nẵng</h1>

        <div className={styles["content"]}>
          <div className={styles["partials"]}>
            <label className={styles["partials-title"]}>Thể loại</label>
            <Select onValueChange={handleChangeOption} defaultValue="dog">
              <SelectTrigger className={styles["partials-title-select"]}>
                <SelectValue placeholder="Tìm Chó Lạc" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Tìm Chó Lạc</SelectItem>
                <SelectItem value="cat">Tìm Mèo Lạc</SelectItem>
                <SelectItem value="dogFindOwner">Chó lạc tìm chủ</SelectItem>
                <SelectItem value="catFindOwner">Mèo lạc tìm chủ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={styles["partials"]}>
            <label className={styles["partials-title"]}>Nội dung</label>
            <Textarea
              className={styles["text-area"]}
              ref={contentRef}
              rows={10}
              onChange={handleContent}
            />
          </div>

          <div className={styles["group-actions"]}>
            <Button
              variant="secondary"
              className={styles["assign-btn"]}
              onClick={handleOpenAssign}
            >
              ASSIGN
            </Button>
            <Button
              variant="secondary"
              className={styles["replicate-btn"]}
              onClick={handleReplicate}
            >
              REPLICATE
            </Button>
          </div>

          <div className={styles["partials"]}>
            <label className={styles["partials-title"]}>Bài Viết</label>
            <Textarea
              className={styles["text-area"]}
              ref={finalRef}
              rows={12}
            />
          </div>

          <div className="flex justify-center">
            <Button
              variant="secondary"
              className={styles["copy-btn"]}
              onClick={handleCopy}
            >
              Copy
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={styles["popup-content"]}>
          <DialogHeader>
            <DialogTitle>Chi tiết thông tin</DialogTitle>
          </DialogHeader>
          <div className={styles["popup-container"]}>
            <div className={styles["popup-header"]}>
              <Select
                onValueChange={(value) => (assignInfo.value.name = value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tên" />
                </SelectTrigger>
                <SelectContent>
                  {assignedContent.value.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => (assignInfo.value.breed = value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Giống" />
                </SelectTrigger>
                <SelectContent>
                  {assignedContent.value.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => (assignInfo.value.gender = value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Giới tính" />
                </SelectTrigger>
                <SelectContent>
                  {assignedContent.value.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => (assignInfo.value.location = value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Khu vực lạc" />
                </SelectTrigger>
                <SelectContent>
                  {assignedContent.value.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => (assignInfo.value.time = value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Thời gian lạc" />
                </SelectTrigger>
                <SelectContent>
                  {assignedContent.value.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => (assignInfo.value.info = value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Đặc điểm" />
                </SelectTrigger>
                <SelectContent>
                  {assignedContent.value.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => (assignInfo.value.phone = value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sđt" />
                </SelectTrigger>
                <SelectContent>
                  {assignedContent.value.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className={styles["popup-group-actions"]}>
              <Button
                className={styles["assign-btn"]}
                onClick={handleConfirmAssign}
              >
                ASSIGN
              </Button>
              <Button
                variant="destructive"
                className={styles["reload-btn"]}
                onClick={handleReload}
              >
                RELOAD
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
