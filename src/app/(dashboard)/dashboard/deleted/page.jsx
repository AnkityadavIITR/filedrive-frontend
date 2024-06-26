"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import useAuth from "@/context/useAuth";
import Image from "next/image";
import { getUserData } from "@/axios/api/getUserData";
import { useToast } from "@/components/ui/use-toast";
import { getFromLocalStorage, setLocalStorage } from "@/lib/utils";
import LoadingData from "@/components/dashboard/loadingData";
import useData from "@/context/useData";
import { Button } from "@/components/ui/button";
import UploadFile from "@/components/modals/uploadmodal";
import { DataCard } from "@/components/dashboard/dataCard";
import useTeamModal from "@/context/useTeamModal";
import TeamModal from "@/components/modals/teamModal";
import useTeamInvite from "@/context/useInviteModal";
import InviteModal from "@/components/modals/inviteModal";

const DeletedPage = () => {
  const { currentUser } = useAuth();
  const { userData, setUserData } = useData();
  const { showTeamModal } = useTeamModal();
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const { showInviteModal } = useTeamInvite();

  const isUserSave = getFromLocalStorage("isUserSaved") || false;

  const { toast } = useToast();

  // useEffect(() => {
  //   if (currentUser && isUserSave) {
  //     refetch(); 
  //   }
  // }, [currentUser, isUserSave, refetch]);

  useEffect(() => {
    async function getUserDetail() {

      try {
        const response = await getUserData(setUserData, setLoading);
        if (!response) {
          toast({
            title: "error",
            message: "can't get detail",
          });
        }
      } catch (e) {
        toast({
          title: "error",
          message: "internal error",
        });
      }
      if(error){
          toast({
          title: "error",
          message: "internal error",
        });
      }
    }

    if (currentUser  && isUserSave) {
      getUserDetail();
    }
  }, [isUserSave, currentUser,setUserData,toast]);


  const handleModal = () => {
    setShowUploadModal(true);
  };
  return (
    <main>
      <div className="flex mt-[60px]">
        <div className="px-10 py-10 w-full ml-[16vw] min-h-[92vh] ">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-[35px] font-semibold">Your files</h1>
            <Button onClick={handleModal}>Upload files</Button>
          </div>
          {showUploadModal && (
            <UploadFile
              showModal={showUploadModal}
              setShowModal={setShowUploadModal}
              purpose={"personalUpload"}
            />
          )}
          {loading && <LoadingData />}
          <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {!loading &&
              userData?.length > 0 &&
              userData.map((data) => {
                return <DataCard file={data} key={data._id} />;
              })}
          </div>
          {!loading && !userData?.length && (
            <div className="flex justify-center items-center mt-5">
              <Image
                src="/Images/empty.png"
                alt=""
                className="max-w-[300px] mx-auto "
                width={300}
                height={300}
              />
            </div>
          )}
        </div>
        {showTeamModal && <TeamModal />}
        {showInviteModal && <InviteModal />}
      </div>
    </main>
  );
};

export default DeletedPage;
